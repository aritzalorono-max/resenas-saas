/**
 * Rate limiting basado en la base de datos (Supabase).
 *
 * Se usa DB en lugar de memoria porque la app corre en entornos serverless
 * (Vercel) donde cada invocación puede usar una instancia diferente.
 * El estado en memoria se perdería entre requests.
 *
 * Límites aplicados en send-review-request:
 *   - MAX_PER_WINDOW: no más de 20 solicitudes en 5 minutos por negocio
 *   - MAX_PER_DAY:    no más de 200 solicitudes en 24 horas por negocio
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface RateLimitResult {
  allowed: boolean;
  /** Cuántas solicitudes se han hecho en la ventana actual */
  count: number;
  /** Mensaje de error legible si allowed === false */
  error?: string;
}

const MAX_PER_WINDOW = 20;
const WINDOW_MINUTES = 5;

const MAX_PER_DAY = 200;
const DAY_MINUTES = 24 * 60;

/**
 * Comprueba si un negocio ha superado los límites de envío.
 *
 * Realiza dos comprobaciones independientes:
 *   1. No más de MAX_PER_WINDOW envíos en los últimos WINDOW_MINUTES minutos
 *   2. No más de MAX_PER_DAY envíos en las últimas 24 horas
 *
 * @param supabase   - Cliente de Supabase autenticado con la sesión del usuario
 * @param businessId - ID del negocio a comprobar
 * @returns RateLimitResult con allowed=false y error descriptivo si se supera algún límite
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  businessId: string
): Promise<RateLimitResult> {
  // ── Ventana corta (spam inmediato) ────────────────────────────────────────
  const shortWindowStart = new Date(
    Date.now() - WINDOW_MINUTES * 60 * 1000
  ).toISOString();

  const { count: shortCount, error: shortError } = await supabase
    .from("review_requests")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", shortWindowStart);

  if (shortError) {
    // Si no podemos comprobar el rate limit, bloqueamos por precaución
    return {
      allowed: false,
      count: 0,
      error: "No se pudo verificar el límite de envíos. Inténtalo en unos segundos.",
    };
  }

  if ((shortCount ?? 0) >= MAX_PER_WINDOW) {
    return {
      allowed: false,
      count: shortCount ?? 0,
      error: `Has enviado demasiadas solicitudes. Espera unos minutos antes de continuar (máximo ${MAX_PER_WINDOW} en ${WINDOW_MINUTES} minutos).`,
    };
  }

  // ── Ventana diaria (límite de volumen) ────────────────────────────────────
  const dayWindowStart = new Date(
    Date.now() - DAY_MINUTES * 60 * 1000
  ).toISOString();

  const { count: dayCount, error: dayError } = await supabase
    .from("review_requests")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", dayWindowStart);

  if (dayError) {
    return {
      allowed: false,
      count: 0,
      error: "No se pudo verificar el límite diario. Inténtalo en unos segundos.",
    };
  }

  if ((dayCount ?? 0) >= MAX_PER_DAY) {
    return {
      allowed: false,
      count: dayCount ?? 0,
      error: `Has alcanzado el límite diario de ${MAX_PER_DAY} solicitudes. El contador se reinicia en 24 horas.`,
    };
  }

  return { allowed: true, count: shortCount ?? 0 };
}
