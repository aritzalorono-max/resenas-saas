/**
 * GET /api/cron/send-reminders
 *
 * Cron job que envía recordatorios automáticos a clientes que no respondieron.
 *
 * Lógica de tiempos:
 *   - 1er recordatorio: 24h después del envío inicial (reminder_count = 0)
 *   - 2º recordatorio: 72h después del envío inicial (reminder_count = 1)
 *   - Máximo 2 recordatorios por solicitud
 *
 * Cada recordatorio cuenta como un envío adicional a efectos de facturación.
 * Solo se envía si el negocio tiene reminders_enabled = true.
 *
 * Requiere TWILIO_REMINDER_TEMPLATE_SID en las variables de entorno.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { getTwilioSender, sendWhatsAppTemplateWith } from "@/lib/twilio";
import { logger } from "@/lib/logger";
import { PLAN_MONTHLY_REMINDER_LIMITS, WHATSAPP_TEMPLATE_SIDS } from "@/lib/constants";

export const runtime  = "nodejs";
export const maxDuration = 60;

function maskPhone(phone: string): string {
  return phone.length > 4 ? `****${phone.slice(-4)}` : "****";
}

const MAX_REMINDERS   = 2;
// Horas desde created_at en que se envía cada recordatorio
const REMINDER_HOURS  = [24, 72] as const;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const auth       = request.headers.get("authorization");
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = await createServiceClient();
  const now      = new Date();

  // Busca solicitudes pending con recordatorios pendientes de enviar
  const { data: requests, error } = await supabase
    .from("review_requests")
    .select(`
      id,
      customer_name,
      customer_phone,
      reminder_count,
      created_at,
      businesses!inner (
        id,
        name,
        reminder_max_count,
        subscription_plan,
        whatsapp_language,
        whatsapp_mode,
        own_twilio_account_sid,
        own_twilio_auth_token,
        own_twilio_whatsapp_number
      )
    `)
    .eq("status", "pending")
    .lt("reminder_count", MAX_REMINDERS);

  if (error) {
    logger.error("Cron recordatorios: error consultando solicitudes", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  if (!requests?.length) {
    logger.info("Cron recordatorios: sin solicitudes pendientes");
    return Response.json({ sent: 0 });
  }


  // Pre-fetch monthly usage for all affected businesses in one query (avoids N+1)
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const uniqueBusinessIds = [...new Set(
    requests.map((r) => ((r.businesses as unknown) as { id: string }).id)
  )];

  const { data: allUsageData } = await supabase
    .from("review_requests")
    .select("business_id, reminder_count")
    .in("business_id", uniqueBusinessIds)
    .gte("created_at", monthStart.toISOString());

  const monthlyUsageByBusiness = (allUsageData ?? []).reduce((map, row) => {
    map.set(row.business_id, (map.get(row.business_id) ?? 0) + 1 + (row.reminder_count ?? 0));
    return map;
  }, new Map<string, number>());

  let sent    = 0;
  let skipped = 0;

  for (const req of requests) {
    const business = (req.businesses as unknown) as {
      id: string;
      name: string;
      reminder_max_count: number;
      subscription_plan: string | null;
      whatsapp_language: string | null;
      whatsapp_mode: string | null;
      own_twilio_account_sid: string | null;
      own_twilio_auth_token: string | null;
      own_twilio_whatsapp_number: string | null;
    };

    if (!business.reminder_max_count || req.reminder_count >= business.reminder_max_count) { skipped++; continue; }

    const createdAt     = new Date(req.created_at);
    const hoursElapsed  = (now.getTime() - createdAt.getTime()) / 3_600_000;
    const targetHours   = REMINDER_HOURS[req.reminder_count as 0 | 1];

    if (hoursElapsed < targetHours) { skipped++; continue; }

    const planKey   = (business.subscription_plan ?? "free") as keyof typeof PLAN_MONTHLY_REMINDER_LIMITS;
    const planLimit = PLAN_MONTHLY_REMINDER_LIMITS[planKey] ?? 5;
    const monthlyUsage = monthlyUsageByBusiness.get(business.id) ?? 0;

    if (monthlyUsage >= planLimit) {
      logger.info(`Cron recordatorios: negocio ${business.id} alcanzó límite mensual`);
      skipped++;
      continue;
    }

    // Enviar recordatorio
    try {
      const { client, fromNumber } = getTwilioSender(business);
      const lang = (business.whatsapp_language ?? "es") as keyof typeof WHATSAPP_TEMPLATE_SIDS;
      const reminderSid = WHATSAPP_TEMPLATE_SIDS[lang].review_reminder;
      await sendWhatsAppTemplateWith(client, fromNumber, req.customer_phone, reminderSid, {
        "1": req.customer_name,
        "2": business.name,
      });

      await supabase
        .from("review_requests")
        .update({
          reminder_count:   req.reminder_count + 1,
          last_reminder_at: now.toISOString(),
        })
        .eq("id", req.id);

      logger.info(`Recordatorio ${req.reminder_count + 1} enviado a ${req.customer_name} (${maskPhone(req.customer_phone)})`);
      sent++;
    } catch (err) {
      logger.error(`Error enviando recordatorio a ${maskPhone(req.customer_phone)}`, err);
      skipped++;
    }
  }

  logger.info(`Cron recordatorios: ${sent} enviados, ${skipped} omitidos`);
  return Response.json({ sent, skipped });
}
