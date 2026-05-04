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
const DAY_MINUTES    = 24 * 60;

export async function checkRateLimit(
  supabase: SupabaseClient,
  businessId: string
): Promise<RateLimitResult> {
  const shortWindowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count: shortCount, error: shortError } = await supabase
    .from("review_requests")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", shortWindowStart);

  if (shortError) {
    return { allowed: false, count: 0, error: "No se pudo verificar el límite de envíos. Inténtalo en unos segundos." };
  }

  if ((shortCount ?? 0) >= MAX_PER_WINDOW) {
    return { allowed: false, count: shortCount ?? 0, error: `Has enviado demasiadas solicitudes. Espera unos minutos antes de continuar (máximo ${MAX_PER_WINDOW} en ${WINDOW_MINUTES} minutos).` };
  }

  const dayWindowStart = new Date(Date.now() - DAY_MINUTES * 60 * 1000).toISOString();

  const { count: dayCount, error: dayError } = await supabase
    .from("review_requests")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", dayWindowStart);

  if (dayError) {
    return { allowed: false, count: 0, error: "No se pudo verificar el límite diario. Inténtalo en unos segundos." };
  }

  if ((dayCount ?? 0) >= MAX_PER_DAY) {
    return { allowed: false, count: dayCount ?? 0, error: `Has alcanzado el límite diario de ${MAX_PER_DAY} solicitudes. El contador se reinicia en 24 horas.` };
  }

  return { allowed: true, count: shortCount ?? 0 };
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
    .select("*", { count: "exact", head: true })
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
