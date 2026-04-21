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
const SCREENSHOT_SYSTEM_PROMPT = `Eres un verificador de reseñas de Google Maps.
Tu tarea es analizar una imagen que debería ser una captura de pantalla de una reseña de Google Maps y determinar si muestra claramente una puntuación de 5 estrellas.

Responde SIEMPRE con un JSON válido con esta estructura exacta:
{
  "isFiveStars": true | false,
  "confidence": número entre 0.0 y 1.0 (certeza de tu análisis),
  "reason": "explicación breve en español (máximo 100 caracteres)"
}

Criterios:
- "isFiveStars": true SOLO si se ven claramente 5 estrellas rellenas en una reseña de Google Maps
- Si la imagen es borrosa, no es de Google Maps, o muestra menos de 5 estrellas, devuelve false
- Sé conservador: en caso de duda, devuelve false`;

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
