/**
 * Integración con la API de Claude (Anthropic).
 *
 * Este módulo es responsable únicamente del análisis de sentimiento.
 * La construcción de mensajes de seguimiento está en /lib/messages.ts.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { SentimentResult, ScreenshotResult } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/**
 * Prompt del sistema para el análisis de sentimiento.
 * Instruye a Claude a devolver siempre un JSON estructurado
 * para facilitar el parsing de la respuesta.
 */
const SENTIMENT_SYSTEM_PROMPT = `Eres un analizador de opiniones de clientes para negocios locales.
Tu tarea es analizar el texto de la respuesta de un cliente y determinar si es positiva, negativa o neutral.

Responde SIEMPRE con un JSON válido con esta estructura exacta:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": número entre 0.0 y 1.0 (donde 1.0 es la máxima positividad),
  "summary": "breve resumen de la opinión en español (máximo 100 caracteres)"
}

Criterios de clasificación:
- "positive": el cliente está satisfecho, recomienda el servicio, usa palabras claramente positivas
- "negative": el cliente está insatisfecho, tiene quejas, usa palabras negativas
- "neutral": la opinión es ambigua, poco clara, o usa expresiones como "bien", "ok", "normal"

Sé estricto: solo clasifica como "positive" cuando haya satisfacción evidente.`;

/**
 * Analiza el texto de respuesta de un cliente y devuelve el sentimiento detectado.
 *
 * Usa el modelo claude-sonnet-4-6 con temperatura baja implícita para
 * maximizar la coherencia del JSON de salida.
 *
 * @param customerResponse - Texto libre que el cliente ha enviado por WhatsApp
 * @returns Objeto con sentimiento, puntuación numérica y resumen textual
 * @throws Si la respuesta de Claude no es un JSON válido con la estructura esperada
 */
const SCREENSHOT_SYSTEM_PROMPT = `Eres un verificador de reseñas de plataformas como Google Maps, Trustpilot, TripAdvisor, Yelp, Booking.com, Facebook y otras.
Tu tarea es analizar una imagen que debería ser una captura de pantalla de una reseña publicada y determinar si muestra la puntuación máxima posible en esa plataforma.

Responde SIEMPRE con un JSON válido con esta estructura exacta:
{
  "isFiveStars": true | false,
  "confidence": número entre 0.0 y 1.0 (certeza de tu análisis),
  "reason": "explicación breve en español (máximo 100 caracteres)"
}

Criterios por plataforma — "isFiveStars" es true SOLO si se ve claramente la puntuación máxima:
- Google Maps: 5 estrellas amarillas completamente rellenas
- Trustpilot: 5 estrellas verdes / etiqueta "Excelente"
- TripAdvisor: 5 círculos/burbujas completamente rellenos
- Booking.com: puntuación igual o superior a 9.0 sobre 10
- Yelp: 5 estrellas completamente rellenas
- Facebook: 5 estrellas en una recomendación
- Otras plataformas: la puntuación máxima reconocible

Causas para devolver false:
- La imagen es borrosa o ilegible
- No parece ser una reseña de ninguna plataforma conocida
- La puntuación visible es menor que el máximo
- Solo se ven textos sin calificación visible

Sé conservador: en caso de duda, devuelve false.`;

/**
 * Descarga una imagen de Twilio (requiere Basic Auth) y analiza con Claude vision
 * si muestra una reseña de 5 estrellas en Google Maps.
 */
export async function analyzeScreenshot(mediaUrl: string): Promise<ScreenshotResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const imageResponse = await fetch(mediaUrl, {
    headers: { Authorization: `Basic ${credentials}` },
  });

  if (!imageResponse.ok) {
    throw new Error(`No se pudo descargar la imagen de Twilio: ${imageResponse.status}`);
  }

  const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString("base64");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    system: SCREENSHOT_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: contentType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: base64Image,
            },
          },
          {
            type: "text",
            text: "Analiza esta imagen y determina si muestra una reseña de 5 estrellas en Google Maps.",
          },
        ],
      },
    ],
  });

  const rawText =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(rawText) as ScreenshotResult;
}

export async function analyzeSentiment(
  customerResponse: string
): Promise<SentimentResult> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    system: SENTIMENT_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analiza esta respuesta del cliente: "${customerResponse}"`,
      },
    ],
  });

  const rawText =
    response.content[0].type === "text" ? response.content[0].text : "";

  // El modelo siempre devuelve JSON según el system prompt,
  // pero hacemos el cast explícito por seguridad de tipos.
  const result = JSON.parse(rawText) as SentimentResult;
  return result;
}
