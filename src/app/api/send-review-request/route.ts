/**
 * POST /api/send-review-request
 *
 * Envía un mensaje de WhatsApp a un cliente pidiéndole su opinión
 * y crea el registro correspondiente en la base de datos.
 *
 * Flujo:
 *   1. Verificar que el usuario está autenticado
 *   2. Validar y sanear los inputs (nombre + teléfono)
 *   3. Comprobar rate limiting por negocio
 *   4. Obtener la configuración del negocio
 *   5. Enviar el WhatsApp via Twilio
 *   6. Guardar la solicitud en Supabase
 */

import { createClient } from "@/lib/supabase/server";
import { sendWhatsAppMessage } from "@/lib/twilio";
import { getBusinessByUserId } from "@/lib/business";
import { createReviewRequest } from "@/lib/review-requests";
import { validateCustomerName, validatePhone } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

interface SuccessResponse { success: true; data: object }
interface ErrorResponse   { error: string }

export async function POST(
  request: Request
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  logger.info("Nueva solicitud de reseña recibida");

  // ── 1. Autenticación ──────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    logger.warn("Intento de acceso sin sesión activa");
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // ── 2. Parsear y validar inputs ───────────────────────────────────────────
  let rawBody: Record<string, unknown>;
  try {
    rawBody = (await request.json()) as Record<string, unknown>;
  } catch {
    logger.warn("Cuerpo de la petición no es JSON válido");
    return NextResponse.json({ error: "El cuerpo de la petición no es JSON válido" }, { status: 400 });
  }

  const nameResult  = validateCustomerName(rawBody.customer_name);
  const phoneResult = validatePhone(rawBody.customer_phone);

  if (!nameResult.valid) {
    return NextResponse.json({ error: nameResult.error! }, { status: 400 });
  }
  if (!phoneResult.valid) {
    return NextResponse.json({ error: phoneResult.error! }, { status: 400 });
  }

  const customerName  = nameResult.sanitized!;
  const customerPhone = phoneResult.sanitized!;

  logger.info(`Input validado: ${customerName} (${customerPhone})`);

  // ── 3. Obtener negocio ────────────────────────────────────────────────────
  const business = await getBusinessByUserId(supabase, user.id);

  if (!business) {
    logger.warn(`Negocio no encontrado para usuario ${user.id}`);
    return NextResponse.json(
      { error: "Negocio no encontrado. Completa tu perfil en Configuración primero." },
      { status: 404 }
    );
  }

  // ── 4. Rate limiting ──────────────────────────────────────────────────────
  const rateLimit = await checkRateLimit(supabase, business.id);

  if (!rateLimit.allowed) {
    logger.warn(`Rate limit superado para negocio ${business.id} (${rateLimit.count} envíos recientes)`);
    return NextResponse.json({ error: rateLimit.error! }, { status: 429 });
  }

  logger.info(`Negocio: ${business.name} | Envíos recientes: ${rateLimit.count}`);

  // ── 5. Enviar WhatsApp ────────────────────────────────────────────────────
  const activeLink = business.review_links?.find((l) => l.url === business.google_maps_url);
  const platformName = activeLink?.name ?? "Google Maps";

  let messageText = business.welcome_message
    .replace("{nombre}", customerName)
    .replace("{negocio}", business.name);

  const incentiveTiming = business.incentive_timing ?? "initial";
  if (business.incentive_enabled && business.incentive_description && incentiveTiming === "initial") {
    messageText += `\n\nRecuerda que si nos puntúas 5 estrellas en ${platformName} y nos envías una captura de pantalla, te enviaremos ${business.incentive_description} para agradecértelo.`;
  }

  let messageSid: string;
  try {
    messageSid = await sendWhatsAppMessage(customerPhone, messageText);
    logger.info(`WhatsApp enviado. SID: ${messageSid}`);
  } catch (twilioError) {
    logger.error("Error al enviar el WhatsApp via Twilio", twilioError);
    return NextResponse.json(
      { error: "No se pudo enviar el WhatsApp. Comprueba que el número es correcto y que el cliente ha aceptado el sandbox de Twilio." },
      { status: 502 }
    );
  }

  // ── 6. Guardar en base de datos ───────────────────────────────────────────
  let reviewRequest: object;
  try {
    reviewRequest = await createReviewRequest(supabase, {
      business_id: business.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      twilio_message_sid: messageSid,
    });
    logger.info(`Solicitud guardada. ID: ${(reviewRequest as { id: string }).id}`);
  } catch (dbError) {
    logger.error("Error al guardar la solicitud en la BD", dbError);
    return NextResponse.json(
      { error: "El mensaje fue enviado pero no se pudo guardar el registro. Contacta con soporte." },
      { status: 500 }
    );
  }

  logger.info(`Flujo completado para ${customerName}`);
  return NextResponse.json({ success: true, data: reviewRequest });
}
