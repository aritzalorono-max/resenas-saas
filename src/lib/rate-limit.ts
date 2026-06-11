/**
 * Rate limiting basado en la base de datos (Supabase).
 *
 * Se usa DB en lugar de memoria porque la app corre en entornos serverless
 * (Vercel) donde cada invocación puede usar una instancia diferente.
 * El estado en memoria se perdería entre requests.
 *
 * Dos utilidades:
 *   - checkRateLimit: específica para review_requests por negocio
 *   - checkGeneralRateLimit: genérica por clave arbitraria (IP, teléfono, email…)
 *     Requiere la tabla rate_limit_events (migration_017).
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  error?: string;
}

const MAX_PER_WINDOW = 20;
const WINDOW_MINUTES = 5;
const MAX_PER_DAY    = 200;

export async function checkRateLimit(
  supabase: SupabaseClient,
  businessId: string
): Promise<RateLimitResult> {
  const { data, error } = await supabase.rpc("check_business_rate_limit", {
    p_business_id: businessId,
  });

  if (error) {
    return { allowed: false, count: 0, error: "No se pudo verificar el límite de envíos. Inténtalo en unos segundos." };
  }

  const result = data as { allowed: boolean; count: number; reason?: string };

  if (!result.allowed) {
    const msg = result.reason === "day_window"
      ? `Has alcanzado el límite diario de ${MAX_PER_DAY} solicitudes. El contador se reinicia en 24 horas.`
      : `Has enviado demasiadas solicitudes. Espera unos minutos antes de continuar (máximo ${MAX_PER_WINDOW} en ${WINDOW_MINUTES} minutos).`;
    return { allowed: false, count: result.count, error: msg };
  }

  return { allowed: true, count: result.count };
}

/**
 * Rate limiter genérico basado en la tabla rate_limit_events.
 * Usa una clave arbitraria (IP, teléfono, email…) y registra cada evento.
 * Si la clave supera maxRequests en windowMinutes, devuelve allowed=false.
 *
 * Debe usarse con el service client (la tabla no tiene RLS).
 */
export async function checkGeneralRateLimit(
  supabase: SupabaseClient,
  key: string,
  windowMinutes: number,
  maxRequests: number
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("key", key)
    .gte("created_at", windowStart);

  if (error) {
    // Si la tabla no existe aún (migración pendiente), dejamos pasar
    return { allowed: true, count: 0 };
  }

  if ((count ?? 0) >= maxRequests) {
    return {
      allowed: false,
      count: count ?? 0,
      error: `Demasiadas solicitudes. Inténtalo en ${windowMinutes} minutos.`,
    };
  }

  // Registrar este evento
  await supabase.from("rate_limit_events").insert({ key });

  return { allowed: true, count: (count ?? 0) + 1 };
}

/** Extrae la IP del cliente de los headers de Vercel / proxies estándar */
export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
