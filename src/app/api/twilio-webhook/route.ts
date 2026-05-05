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
import { checkGeneralRateLimit, getClientIp } from "@/lib/rate-limit";
import { analyzeSentiment, analyzeScreenshot, generateConversationalResponse } from "@/lib/claude";
import { TWILIO_WHATSAPP_NUMBER, formatWhatsAppNumber, getPhoneVariants, getTwilioSender } from "@/lib/twilio";
import { assignDiscountCode } from "@/lib/discount-codes";
import {
  findPendingRequestByPhone,
  findAwaitingScreenshotByPhone,
  findActiveRequestByPhone,
  updateReviewRequestWithSentiment,
  updateToAwaitingScreenshot,
  updateToRewarded,
  incrementMessageCount,
} from "@/lib/review-requests";
import {
  buildFollowUpMessage,
  buildScreenshotVerifiedMessage,
  buildScreenshotRetryMessage,
  buildConversationClosingMessage,
} from "@/lib/messages";
import { logger } from "@/lib/logger";
import twilio from "twilio";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Masks a phone number showing only the last 4 digits for safe logging */
function maskPhone(phone: string): string {
  return phone.length > 4 ? `****${phone.slice(-4)}` : "****";
}

// Cap multi-turn conversations to prevent runaway exchanges and Twilio cost surprises.
// The closing message is sent on exactly this turn, so the customer always gets a proper goodbye.
const MAX_CONVERSATION_TURNS = 7;

// ---------------------------------------------------------------------------
// Validación de firma de Twilio
// ---------------------------------------------------------------------------

function validateTwilioSignature(request: Request, rawBody: string, authToken: string): boolean {
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

  // ── 0. Rate limiting por IP ───────────────────────────────────────────────
  // Protege contra scraping masivo y ataques de fuerza bruta al endpoint.
  // Límite generoso para no bloquear a Twilio en caso de reintentos legítimos.
  const rateLimitSupabase = await createServiceClient();
  const clientIp = getClientIp(request);
  const ipRateLimit = await checkGeneralRateLimit(
    rateLimitSupabase,
    `webhook:ip:${clientIp}`,
    5,   // ventana: 5 minutos
    120  // max 120 requests/5min por IP (~2 req/s)
  );
  if (!ipRateLimit.allowed) {
    logger.warn(`Rate limit por IP alcanzado: ${clientIp}`);
    return new Response("Too Many Requests", { status: 429 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    logger.error("No se pudo leer el cuerpo del webhook");
    return twilioEmptyResponse();
  }

  // ── 2. Extraer datos del webhook ──────────────────────────────────────────
  const params = new URLSearchParams(rawBody);
  const fromNumber  = params.get("From") ?? "";
  const toNumber    = params.get("To") ?? "";
  const messageBody = params.get("Body") ?? "";
  const numMedia    = parseInt(params.get("NumMedia") ?? "0", 10);
  const mediaUrl    = numMedia > 0 ? (params.get("MediaUrl0") ?? "") : "";
  const hasImage    = numMedia > 0 && mediaUrl.length > 0;

  if (!fromNumber) {
    logger.warn("Webhook sin número de origen");
    return twilioEmptyResponse();
  }

  // Rate limiting por número de teléfono: máx 20 mensajes por hora desde el mismo número
  const phoneRateLimit = await checkGeneralRateLimit(
    rateLimitSupabase,
    `webhook:phone:${fromNumber}`,
    60,  // ventana: 60 minutos
    20   // max 20 mensajes/hora por número
  );
  if (!phoneRateLimit.allowed) {
    logger.warn(`Rate limit por teléfono alcanzado: ${maskPhone(fromNumber)}`);
    return twilioEmptyResponse(); // Respuesta vacía (no error) para no alertar al abusador
  }

  logger.info(`Mensaje recibido de ${maskPhone(fromNumber)} → ${toNumber} | media: ${numMedia} | len: ${messageBody.length}`);

  // ── 1. Validar firma (producción) ─────────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    const isSharedNumber = toNumber.includes(TWILIO_WHATSAPP_NUMBER.replace("whatsapp:", ""));
    let authToken: string | null = null;

    if (isSharedNumber) {
      authToken = process.env.TWILIO_AUTH_TOKEN ?? null;
    } else {
      // Own-mode: look up the business by its Twilio number to get the auth token
      const supabaseEarly = await createServiceClient();
      const { data: bizForAuth } = await supabaseEarly
        .from("businesses")
        .select("own_twilio_auth_token")
        .eq("own_twilio_whatsapp_number", toNumber)
        .maybeSingle();
      authToken = bizForAuth?.own_twilio_auth_token ?? null;
    }

    if (!authToken) {
      logger.warn("No se pudo obtener auth token para validar firma — petición rechazada");
      return twilioEmptyResponse();
    }

    const isValid = validateTwilioSignature(request, rawBody, authToken);
    if (!isValid) {
      logger.warn("Firma de Twilio inválida — petición rechazada");
      return twilioEmptyResponse();
    }
    logger.info("Firma de Twilio validada correctamente");
  }

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
      const screenshotActiveLink = business.review_links?.find((l) => l.url === business.google_maps_url);
      const activePlatformName   = screenshotActiveLink?.name ?? "Google Maps";

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

      const { client: screenshotClient, fromNumber: screenshotFrom } = getTwilioSender(business);

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
          activePlatformName,
          screenshotRequest.discount_code
        );

        try {
          await screenshotClient.messages.create({
            from: screenshotFrom,
            to:   formatWhatsAppNumber(screenshotRequest.customer_phone),
            body: verifiedMsg,
          });
          logger.info(`Mensaje de recompensa enviado a ${maskPhone(screenshotRequest.customer_phone)}`);
        } catch (twilioError) {
          logger.error("Error al enviar el mensaje de recompensa", twilioError);
        }
      } else {
        const retryMsg = buildScreenshotRetryMessage(screenshotRequest.customer_name, tone);

        try {
          await screenshotClient.messages.create({
            from: screenshotFrom,
            to:   formatWhatsAppNumber(screenshotRequest.customer_phone),
            body: retryMsg,
          });
          logger.info(`Mensaje de reintento de captura enviado a ${maskPhone(screenshotRequest.customer_phone)}`);
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

  logger.info(`Buscando solicitud pendiente para ${maskPhone(fromNumber)}`);
  const reviewRequest = await findPendingRequestByPhone(supabase, phoneVariants);

  if (!reviewRequest) {
    // ── 3c. Flujo multi-turno: cliente responde después del primer intercambio ─
    logger.info("Sin solicitud pendiente — buscando solicitud activa para conversación multi-turno");
    const activeRequest = await findActiveRequestByPhone(supabase, phoneVariants);

    if (!activeRequest) {
      logger.warn(`No se encontró solicitud activa para ${maskPhone(fromNumber)}`);
      return twilioEmptyResponse();
    }

    logger.info(`Solicitud activa encontrada: ${activeRequest.id} (message_count: ${activeRequest.message_count})`);
    const { businesses: activeBusiness } = activeRequest;

    const newCount = await incrementMessageCount(supabase, activeRequest.id, activeRequest.message_count);

    if (newCount > MAX_CONVERSATION_TURNS) {
      logger.info(`Límite de ${MAX_CONVERSATION_TURNS} turnos superado para ${activeRequest.id} — sin respuesta`);
      return twilioEmptyResponse();
    }

    const { client: conversationClient, fromNumber: conversationFrom } = getTwilioSender(activeBusiness);

    let conversationResponse: string;

    if (newCount === MAX_CONVERSATION_TURNS) {
      conversationResponse = buildConversationClosingMessage(
        activeRequest.customer_name,
        activeBusiness.name,
        activeBusiness.tone ?? "tuteo"
      );
      logger.info(`Enviando mensaje de cierre (turno ${MAX_CONVERSATION_TURNS}/${MAX_CONVERSATION_TURNS}) a ${maskPhone(activeRequest.customer_phone)}`);
    } else {
      try {
        conversationResponse = await generateConversationalResponse(
          messageBody,
          activeBusiness.name,
          activeBusiness.tone ?? "tuteo"
        );
        logger.info(`Respuesta conversacional generada (turno ${newCount}/${MAX_CONVERSATION_TURNS})`);
      } catch (aiError) {
        logger.error("Error al generar respuesta conversacional con Claude", aiError);
        return twilioEmptyResponse();
      }
    }

    try {
      await conversationClient.messages.create({
        from: conversationFrom,
        to:   formatWhatsAppNumber(activeRequest.customer_phone),
        body: conversationResponse,
      });
      logger.info(`Respuesta conversacional enviada a ${maskPhone(activeRequest.customer_phone)}`);
    } catch (twilioError) {
      logger.error("Error al enviar respuesta conversacional", twilioError);
    }

    return twilioEmptyResponse();
  }

  logger.info(`Solicitud encontrada: ${reviewRequest.id} (cliente: ${reviewRequest.customer_name})`);
  const { businesses: business } = reviewRequest;
  logger.info(`Datos negocio — incentive_enabled: ${business.incentive_enabled}, incentive_description: "${business.incentive_description}", google_maps_url: ${!!business.google_maps_url}`);
  const activeLink       = business.review_links?.find((l) => l.url === business.google_maps_url);
  const activePlatformName = activeLink?.name ?? "Google Maps";
  const appOrigin        = new URL(request.url).origin;
  const placeReviewUrl   = business.google_place_id
    ? `https://search.google.com/local/writereview?placeid=${business.google_place_id}`
    : null;
  const reviewUrl        = activeLink?.shortCode
    ? `${appOrigin}/r/${activeLink.shortCode}`
    : (placeReviewUrl ?? business.google_maps_url ?? "");

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

  let assignedCode: string | null = null;

  try {
    if (useIncentive) {
      if (business.incentive_code_enabled) {
        assignedCode = await assignDiscountCode(
          supabase,
          reviewRequest.business_id,
          business.incentive_code_type ?? "random",
          reviewRequest.id,
          business.incentive_fixed_code
        );
        if (assignedCode) {
          logger.info(`Código de descuento asignado: ${assignedCode}`);
        } else {
          logger.warn("No se pudo asignar código de descuento (pool vacío o error)");
        }
      }
      await updateToAwaitingScreenshot(supabase, reviewRequest.id, messageBody, sentiment.score, assignedCode);
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
    customerName:         reviewRequest.customer_name,
    businessName:         business.name,
    googleMapsUrl:        reviewUrl || null,
    sentiment:            sentiment.sentiment,
    tone:                 business.tone ?? "tuteo",
    platformName:         activePlatformName,
    incentiveEnabled:     business.incentive_enabled,
    incentiveDescription: business.incentive_description,
    discountCode:         assignedCode,
  });

  const { client: followUpClient, fromNumber: followUpFrom } = getTwilioSender(business);

  try {
    await followUpClient.messages.create({
      from: followUpFrom,
      to:   formatWhatsAppNumber(reviewRequest.customer_phone),
      body: followUpMessage,
    });
    logger.info(`Mensaje de seguimiento enviado a ${maskPhone(reviewRequest.customer_phone)}`);
  } catch (twilioError) {
    logger.error("Error al enviar el mensaje de seguimiento via Twilio", twilioError);
  }

  logger.info(`Flujo completado para solicitud ${reviewRequest.id}`);
  return twilioEmptyResponse();
}
