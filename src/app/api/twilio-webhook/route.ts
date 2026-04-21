/**
 * POST /api/twilio-webhook
 *
 * Recibe las respuestas de los clientes por WhatsApp (webhook de Twilio),
 * analiza el sentimiento con Claude y envía un mensaje de seguimiento adaptado.
 *
 * Flujo normal (sin incentivo o sin imagen):
 *   1. Validar la firma de Twilio (solo en producción)
 *   2. Extraer el número y el mensaje del cuerpo del webhook
 *   3. Buscar la solicitud de reseña pendiente para ese número
 *   4. Analizar el sentimiento con Claude AI
 *   5. Actualizar el registro en la base de datos
 *   6. Enviar el mensaje de seguimiento apropiado
 *
 * Flujo con incentivo (positivo + incentive_enabled):
 *   - En vez del mensaje estándar, se envía el mensaje de oferta de incentivo
 *   - El estado pasa a awaiting_screenshot en BD
 *
 * Flujo de captura (awaiting_screenshot + imagen adjunta):
 *   1. Detectar imagen en NumMedia / MediaUrl0
 *   2. Buscar solicitud awaiting_screenshot para ese número
 *   3. Claude vision analiza si muestra 5★ en Google Maps
 *   4. Si sí → enviar mensaje de recompensa + marcar como rewarded
 *   5. Si no → pedir captura más clara
 */

import { createServiceClient } from "@/lib/supabase/server";
import { analyzeSentiment, analyzeScreenshot } from "@/lib/claude";
import { twilioClient, TWILIO_WHATSAPP_NUMBER, formatWhatsAppNumber, getPhoneVariants } from "@/lib/twilio";
import {
  findPendingRequestByPhone,
  findAwaitingScreenshotByPhone,
  updateReviewRequestWithSentiment,
  updateToAwaitingScreenshot,
  updateToRewarded,
} from "@/lib/review-requests";
import {
  buildFollowUpMessage,
  buildScreenshotVerifiedMessage,
  buildScreenshotRetryMessage,
} from "@/lib/messages";
import { logger } from "@/lib/logger";
import twilio from "twilio";

// ---------------------------------------------------------------------------
// Validación de firma de Twilio
// ---------------------------------------------------------------------------

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
  const numMedia = parseInt(params.get("NumMedia") ?? "0", 10);
  const mediaUrl = numMedia > 0 ? (params.get("MediaUrl0") ?? "") : "";
  const hasImage = numMedia > 0 && mediaUrl.length > 0;

  if (!fromNumber) {
    logger.warn("Webhook sin número de origen");
    return twilioEmptyResponse();
  }

  logger.info(`Mensaje recibido de ${fromNumber} | media: ${numMedia} | body: "${messageBody.slice(0, 60)}"`);

  const supabase = await createServiceClient();
  const phoneVariants = getPhoneVariants(fromNumber);

  // ── 3a. Flujo de captura: imagen adjunta ──────────────────────────────────
  if (hasImage) {
    logger.info("Imagen detectada — buscando solicitud awaiting_screenshot");

    const screenshotRequest = await findAwaitingScreenshotByPhone(supabase, phoneVariants);

    if (screenshotRequest) {
      logger.info(`Solicitud awaiting_screenshot encontrada: ${screenshotRequest.id}`);
      const { businesses: business } = screenshotRequest;
      const tone = business.tone ?? "tuteo";
      const incentiveDescription = business.incentive_description ?? "";
      const activePlatformName =
        business.review_links?.find((l) => l.url === business.google_maps_url)?.name ?? "Google Maps";

      let screenshotResult: Awaited<ReturnType<typeof analyzeScreenshot>>;
      try {
        screenshotResult = await analyzeScreenshot(mediaUrl);
        logger.info(
          `Análisis de captura: isFiveStars=${screenshotResult.isFiveStars} (confidence: ${screenshotResult.confidence})`,
          { reason: screenshotResult.reason }
        );
      } catch (aiError) {
        logger.error("Error al analizar la captura con Claude", aiError);
        return twilioEmptyResponse();
      }

      if (screenshotResult.isFiveStars) {
        try {
          await updateToRewarded(supabase, screenshotRequest.id);
          logger.info(`Solicitud ${screenshotRequest.id} marcada como rewarded`);
        } catch (dbError) {
          logger.error("Error al actualizar la solicitud a rewarded", dbError);
        }

        const verifiedMsg = buildScreenshotVerifiedMessage(
          screenshotRequest.customer_name,
          business.name,
          incentiveDescription,
          tone,
          activePlatformName
        );

        try {
          await twilioClient.messages.create({
            from: TWILIO_WHATSAPP_NUMBER,
            to: formatWhatsAppNumber(screenshotRequest.customer_phone),
            body: verifiedMsg,
          });
          logger.info(`Mensaje de recompensa enviado a ${screenshotRequest.customer_phone}`);
        } catch (twilioError) {
          logger.error("Error al enviar el mensaje de recompensa", twilioError);
        }
      } else {
        const retryMsg = buildScreenshotRetryMessage(screenshotRequest.customer_name, tone);

        try {
          await twilioClient.messages.create({
            from: TWILIO_WHATSAPP_NUMBER,
            to: formatWhatsAppNumber(screenshotRequest.customer_phone),
            body: retryMsg,
          });
          logger.info(`Mensaje de reintento de captura enviado a ${screenshotRequest.customer_phone}`);
        } catch (twilioError) {
          logger.error("Error al enviar el mensaje de reintento", twilioError);
        }
      }

      return twilioEmptyResponse();
    }

    logger.info("No se encontró solicitud awaiting_screenshot para esta imagen — continuando flujo normal");
  }

  // ── 3b. Flujo normal: buscar solicitud pendiente ──────────────────────────
  if (!messageBody) {
    logger.warn("Webhook sin cuerpo de mensaje y sin imagen procesable");
    return twilioEmptyResponse();
  }

  logger.info("Buscando solicitud pendiente para variantes de número", phoneVariants);
  const reviewRequest = await findPendingRequestByPhone(supabase, phoneVariants);

  if (!reviewRequest) {
    logger.warn(`No se encontró solicitud pendiente para ${fromNumber}`);
    return twilioEmptyResponse();
  }

  logger.info(`Solicitud encontrada: ${reviewRequest.id} (cliente: ${reviewRequest.customer_name})`);
  const { businesses: business } = reviewRequest;
  const activePlatformName =
    business.review_links?.find((l) => l.url === business.google_maps_url)?.name ?? "Google Maps";

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
  const useIncentive =
    sentiment.sentiment === "positive" &&
    business.google_maps_url &&
    business.incentive_enabled &&
    business.incentive_description;

  try {
    if (useIncentive) {
      await updateToAwaitingScreenshot(supabase, reviewRequest.id, messageBody, sentiment.score);
      logger.info(`Solicitud ${reviewRequest.id} → awaiting_screenshot (incentivo activo)`);
    } else {
      await updateReviewRequestWithSentiment(supabase, reviewRequest.id, messageBody, sentiment);
      logger.info(`Solicitud ${reviewRequest.id} actualizada con sentimiento: ${sentiment.sentiment}`);
    }
  } catch (dbError) {
    logger.error("Error al actualizar la solicitud en la BD", dbError);
  }

  // ── 6. Construir y enviar mensaje de seguimiento ──────────────────────────
  const followUpMessage = buildFollowUpMessage({
    customerName: reviewRequest.customer_name,
    businessName: business.name,
    googleMapsUrl: business.google_maps_url,
    sentiment: sentiment.sentiment,
    tone: business.tone ?? "tuteo",
    platformName: activePlatformName,
    incentiveEnabled: business.incentive_enabled,
    incentiveDescription: business.incentive_description,
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
