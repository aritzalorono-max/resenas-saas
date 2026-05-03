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
- "positive": el cliente expresa satisfacción, aunque sea leve. Incluye respuestas como "bien", "todo bien", "ok", "correcto", "me gustó", "muy bien", "genial", "perfecto", "contento/a", "satisfecho/a", o cualquier expresión que no sea negativa ni ambivalente. El score refleja el grado: 0.55–0.70 para respuestas positivas simples ("bien", "ok"), 0.75–0.90 para claramente positivas ("muy bien", "genial"), 0.90–1.0 para muy entusiastas.
- "negative": el cliente expresa insatisfacción, tiene quejas concretas o usa palabras negativas ("mal", "fatal", "decepcionante", "no volvería", etc.).
- "neutral": la opinión es genuinamente ambivalente o mixta (mezcla aspectos positivos y negativos), o el mensaje no expresa ninguna opinión sobre la experiencia (preguntas, mensajes fuera de contexto, respuestas sin sentido).

En caso de duda entre "positive" y "neutral", clasifica como "positive" con score bajo.`;

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

  const ALLOWED_MEDIA_ORIGINS = [
    "https://api.twilio.com/",
    "https://media.twiliocdn.com/",
    "https://mcs.us1.twilio.com/",
  ];
  if (!ALLOWED_MEDIA_ORIGINS.some(o => mediaUrl.startsWith(o))) {
    throw new Error("URL de media no permitida");
  }

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
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(cleaned) as ScreenshotResult;
}

const CONVERSATIONAL_SYSTEM_PROMPT = `Eres el Asistente de ReseñasYa, una IA diseñada para recoger feedback de clientes de negocios locales.

Reglas que debes seguir siempre:
1. Si alguien te pregunta qué eres, identifícate como "Asistente de ReseñasYa, una IA para recoger feedback de clientes".
2. Nunca uses palabras malsonantes ni lenguaje inapropiado.
3. Mantente centrado en recoger feedback sobre la experiencia del cliente con {negocio}.
4. Sé amable, breve y directo. Máximo 2-3 frases por respuesta.
5. Si el cliente hace preguntas sobre el negocio que no puedes responder (horarios, precios, reservas, etc.), dile que lo mejor es contactar directamente con {negocio}.
6. No inventes información sobre el negocio.

Responde solo con el texto del mensaje de WhatsApp, sin JSON ni formatos especiales.`;

/**
 * Genera una respuesta conversacional para mensajes posteriores al primer intercambio.
 * Aplica las reglas del asistente: identificación, sin lenguaje inapropiado,
 * enfoque en feedback y redirección a negocio para preguntas específicas.
 */
export async function generateConversationalResponse(
  customerMessage: string,
  businessName: string,
  tone: string
): Promise<string> {
  const toneInstruction =
    tone === "usted"
      ? "Usa siempre el tratamiento de 'usted' (formal)."
      : tone === "juvenil"
      ? "Usa un tono muy informal y desenfadado (tuteo juvenil)."
      : "Usa el tuteo (tono informal amigable).";

  const systemPrompt =
    CONVERSATIONAL_SYSTEM_PROMPT.replace(/{negocio}/g, businessName) +
    `\n\nTono: ${toneInstruction}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: systemPrompt,
    messages: [{ role: "user", content: customerMessage }],
  });

  return response.content[0].type === "text" ? response.content[0].text.trim() : "";
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

  const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const result = JSON.parse(cleaned) as SentimentResult;
  return result;
}
