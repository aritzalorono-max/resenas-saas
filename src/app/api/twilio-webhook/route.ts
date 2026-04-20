/**
 * POST /api/twilio-webhook
 *
 * Recibe las respuestas de los clientes por WhatsApp (webhook de Twilio),
 * analiza el sentimiento con Claude y envía un mensaje de seguimiento adaptado.
 *
 * Flujo:
 *   1. Validar la firma de Twilio (solo en producción)
 *   2. Extraer el número y el mensaje del cuerpo del webhook
 *   3. Buscar la solicitud de reseña pendiente para ese número
 *   4. Analizar el sentimiento con Claude AI
 *   5. Actualizar el registro en la base de datos
 *   6. Enviar el mensaje de seguimiento apropiado
 */

import { createServiceClient } from "@/lib/supabase/server";
import { analyzeSentiment } from "@/lib/claude";
import { twilioClient, TWILIO_WHATSAPP_NUMBER, formatWhatsAppNumber, getPhoneVariants } from "@/lib/twilio";
import { findPendingRequestByPhone, updateReviewRequestWithSentiment } from "@/lib/review-requests";
import { buildFollowUpMessage } from "@/lib/messages";
import { logger } from "@/lib/logger";
import twilio from "twilio";

// ---------------------------------------------------------------------------
// Validación de firma de Twilio
// ---------------------------------------------------------------------------

/**
 * Comprueba que la petición proviene realmente de Twilio
 * usando el algoritmo HMAC-SHA1 con el auth token como clave.
 * Solo se activa en producción para permitir pruebas locales.
 */
function validateTwilioSignature(request: Request, rawBody: string): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const signature = request.headers.get("x-twilio-signature") ?? "";

  return twilio.validateRequest(
    authToken,
    signature,
    request.url,
    Object.fromEntries(new URLSearchParams(rawBody))
  );
}

/** Respuesta vacía válida para Twilio (no dispara ningún mensaje adicional) */
function twilioEmptyResponse(): Response {
  return new Response("<Response/>", { headers: { "Content-Type": "text/xml" } });
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(request: Request): Promise<Response> {
  logger.info("Webhook de Twilio recibido");

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    logger.error("No se pudo leer el cuerpo del webhook");
    return twilioEmptyResponse();
  }

  // ── 1. Validar firma (producción) ─────────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    const isValid = validateTwilioSignature(request, rawBody);
    if (!isValid) {
      logger.warn("Firma de Twilio inválida — petición rechazada");
      return twilioEmptyResponse();
    }
    logger.info("Firma de Twilio validada correctamente");
  }

  // ── 2. Extraer datos del webhook ──────────────────────────────────────────
  const params = new URLSearchParams(rawBody);
  const fromNumber = params.get("From") ?? "";
  const messageBody = params.get("Body") ?? "";

  if (!fromNumber || !messageBody) {
    logger.warn("Webhook sin número de origen o sin cuerpo de mensaje", { fromNumber, messageBody });
    return twilioEmptyResponse();
  }

  logger.info(`Mensaje recibido de ${fromNumber}: "${messageBody.slice(0, 60)}..."`);

  // ── 3. Buscar solicitud pendiente ─────────────────────────────────────────
  const supabase = await createServiceClient();
  const phoneVariants = getPhoneVariants(fromNumber);

  logger.info("Buscando solicitud pendiente para variantes de número", phoneVariants);

  const reviewRequest = await findPendingRequestByPhone(supabase, phoneVariants);

  if (!reviewRequest) {
    logger.warn(`No se encontró solicitud pendiente para ${fromNumber}`);
    return twilioEmptyResponse();
  }

  logger.info(`Solicitud encontrada: ${reviewRequest.id} (cliente: ${reviewRequest.customer_name})`);

  const { businesses: business } = reviewRequest;

  // ── 4. Analizar sentimiento con Claude ────────────────────────────────────
  let sentiment: Awaited<ReturnType<typeof analyzeSentiment>>;
  try {
    sentiment = await analyzeSentiment(messageBody);
    logger.info(
      `Sentimiento detectado: ${sentiment.sentiment} (score: ${sentiment.score})`,
      { summary: sentiment.summary }
    );
  } catch (aiError) {
    logger.error("Error al analizar sentimiento con Claude", aiError);
    return twilioEmptyResponse();
  }

  // ── 5. Actualizar registro en base de datos ───────────────────────────────
  try {
    await updateReviewRequestWithSentiment(supabase, reviewRequest.id, messageBody, sentiment);
    logger.info(`Solicitud ${reviewRequest.id} actualizada con sentimiento: ${sentiment.sentiment}`);
  } catch (dbError) {
    logger.error("Error al actualizar la solicitud en la BD", dbError);
    // Continuamos para intentar enviar el mensaje de seguimiento igualmente
  }

  // ── 6. Construir y enviar mensaje de seguimiento ──────────────────────────
  const followUpMessage = buildFollowUpMessage({
    customerName: reviewRequest.customer_name,
    businessName: business.name,
    googleMapsUrl: business.google_maps_url,
    sentiment: sentiment.sentiment,
    tone: business.tone ?? "tuteo",
  });

  try {
    await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: formatWhatsAppNumber(reviewRequest.customer_phone),
      body: followUpMessage,
    });
    logger.info(`Mensaje de seguimiento enviado a ${reviewRequest.customer_phone}`);
  } catch (twilioError) {
    logger.error("Error al enviar el mensaje de seguimiento via Twilio", twilioError);
  }

  logger.info(`Flujo completado para solicitud ${reviewRequest.id}`);
  return twilioEmptyResponse();
}
