/**
 * Operaciones de base de datos para la entidad ReviewRequest (solicitud de reseña).
 *
 * Centraliza todos los accesos a la tabla `review_requests` de Supabase
 * para que los API routes no contengan lógica de persistencia directa.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReviewRequest, ReviewRequestWithBusiness, SentimentResult } from "@/types";

// ---------------------------------------------------------------------------
// Lectura
// ---------------------------------------------------------------------------

/**
 * Busca la solicitud de reseña pendiente más reciente para un número de teléfono.
 *
 * Acepta múltiples variantes del número (con/sin prefijo) para cubrir
 * distintos formatos que puede devolver Twilio.
 * Devuelve null si no hay ninguna solicitud pendiente para ese número.
 */
export async function findPendingRequestByPhone(
  supabase: SupabaseClient,
  phoneVariants: string[]
): Promise<ReviewRequestWithBusiness | null> {
  const { data } = await supabase
    .from("review_requests")
    .select("*, businesses(*)")
    .in("customer_phone", phoneVariants)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (data as ReviewRequestWithBusiness) ?? null;
}

/**
 * Busca la solicitud en estado awaiting_screenshot para un número de teléfono.
 * Se usa cuando el cliente envía una captura de pantalla para reclamar el incentivo.
 */
export async function findAwaitingScreenshotByPhone(
  supabase: SupabaseClient,
  phoneVariants: string[]
): Promise<ReviewRequestWithBusiness | null> {
  const { data } = await supabase
    .from("review_requests")
    .select("*, businesses(*)")
    .in("customer_phone", phoneVariants)
    .eq("status", "awaiting_screenshot")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (data as ReviewRequestWithBusiness) ?? null;
}

// ---------------------------------------------------------------------------
// Escritura
// ---------------------------------------------------------------------------

/**
 * Parámetros necesarios para crear una nueva solicitud de reseña.
 */
export interface CreateReviewRequestParams {
  business_id: string;
  customer_name: string;
  customer_phone: string;
  twilio_message_sid: string;
}

/**
 * Crea un registro de solicitud de reseña en la base de datos.
 * El estado inicial siempre es "pending" hasta que el cliente responda.
 * Lanza un error si la inserción falla.
 */
export async function createReviewRequest(
  supabase: SupabaseClient,
  params: CreateReviewRequestParams
): Promise<ReviewRequest> {
  const { data, error } = await supabase
    .from("review_requests")
    .insert({ ...params, status: "pending" })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Error al crear la solicitud de reseña: ${error?.message ?? "sin datos"}`);
  }

  return data as ReviewRequest;
}

/**
 * Actualiza una solicitud de reseña con el resultado del análisis de sentimiento.
 * Marca también que el mensaje de seguimiento ha sido enviado.
 * Lanza un error si la actualización falla.
 */
export async function updateReviewRequestWithSentiment(
  supabase: SupabaseClient,
  requestId: string,
  customerResponse: string,
  sentiment: SentimentResult
): Promise<void> {
  const { error } = await supabase
    .from("review_requests")
    .update({
      status: sentiment.sentiment,
      customer_response: customerResponse,
      sentiment_score: sentiment.score,
      responded_at: new Date().toISOString(),
      follow_up_sent: true,
    })
    .eq("id", requestId);

  if (error) {
    throw new Error(`Error al actualizar la solicitud ${requestId}: ${error.message}`);
  }
}

/**
 * Cambia el estado de una solicitud positiva a awaiting_screenshot.
 * Se llama cuando se envía el mensaje de incentivo con petición de captura.
 */
export async function updateToAwaitingScreenshot(
  supabase: SupabaseClient,
  requestId: string,
  customerResponse: string,
  sentimentScore: number,
  discountCode?: string | null
): Promise<void> {
  const { error } = await supabase
    .from("review_requests")
    .update({
      status: "awaiting_screenshot",
      customer_response: customerResponse,
      sentiment_score: sentimentScore,
      responded_at: new Date().toISOString(),
      follow_up_sent: true,
      ...(discountCode ? { discount_code: discountCode } : {}),
    })
    .eq("id", requestId);

  if (error) {
    throw new Error(`Error al actualizar la solicitud ${requestId} a awaiting_screenshot: ${error.message}`);
  }
}

/**
 * Busca la solicitud más reciente con estado positivo/negativo/neutral para un número.
 * Se usa para continuar conversaciones multi-turno después del primer intercambio.
 */
export async function findActiveRequestByPhone(
  supabase: SupabaseClient,
  phoneVariants: string[]
): Promise<ReviewRequestWithBusiness | null> {
  const { data } = await supabase
    .from("review_requests")
    .select("*, businesses(*)")
    .in("customer_phone", phoneVariants)
    .in("status", ["positive", "negative", "neutral"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (data as ReviewRequestWithBusiness) ?? null;
}

/**
 * Incrementa el contador de mensajes de una solicitud y devuelve el nuevo valor.
 */
export async function incrementMessageCount(
  supabase: SupabaseClient,
  requestId: string,
  currentCount: number
): Promise<number> {
  const newCount = currentCount + 1;
  await supabase
    .from("review_requests")
    .update({ message_count: newCount })
    .eq("id", requestId);
  return newCount;
}

/**
 * Cambia el estado de una solicitud awaiting_screenshot a rewarded.
 * Se llama cuando Claude verifica las 5 estrellas en la captura.
 */
export async function updateToRewarded(
  supabase: SupabaseClient,
  requestId: string
): Promise<void> {
  const { error } = await supabase
    .from("review_requests")
    .update({ status: "rewarded" })
    .eq("id", requestId);

  if (error) {
    throw new Error(`Error al actualizar la solicitud ${requestId} a rewarded: ${error.message}`);
  }
}
