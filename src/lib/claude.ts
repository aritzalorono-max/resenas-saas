/**
 * Integración con la API de Claude (Anthropic).
 *
 * Este módulo es responsable únicamente del análisis de sentimiento.
 * La construcción de mensajes de seguimiento está en /lib/messages.ts.
 */

import Anthropic from "@anthropic-ai/sdk";
import { logger } from "@/lib/logger";
import type { SentimentResult, ScreenshotResult } from "@/types";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/** Strip optional ```json fences and parse Claude's JSON output. Throws on invalid JSON. */
export function parseClaudeJson<T>(rawText: string, context: string): T {
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    logger.error(`${context}: respuesta de Claude no es JSON válido`, err);
    throw new Error("No se pudo analizar la respuesta de la IA");
  }
}

// Positive-bias rule: when a response is ambiguous between "positive" and "neutral"
// (e.g. "ok", "bien"), we classify it as positive with a lower score. This increases
// the number of customers who receive the review link, at the cost of slightly inflating
// positive metrics. The lower score (0.55–0.70) signals low confidence to the dashboard.
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

  const rawText = response.content[0].type === "text" ? response.content[0].text : "";
  return parseClaudeJson<ScreenshotResult>(rawText, "analyzeScreenshot");
}

const CONVERSATIONAL_SYSTEM_PROMPT = `Eres el Asistente de ResenasYa, una IA diseñada para recoger feedback de clientes de negocios locales.

Reglas que debes seguir siempre:
1. Si alguien te pregunta qué eres, identifícate como "Asistente de ResenasYa, una IA para recoger feedback de clientes".
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

  // Strip newlines and control characters from businessName before interpolating
  // into the system prompt to prevent prompt injection via a crafted business name.
  const safeName = businessName.replace(/[\n\r\t\x00-\x1F\x7F]/g, " ").trim().slice(0, 200);
  const systemPrompt =
    CONVERSATIONAL_SYSTEM_PROMPT.replace(/{negocio}/g, safeName) +
    `\n\nTono: ${toneInstruction}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: systemPrompt,
    messages: [{ role: "user", content: customerMessage }],
  });

  return response.content[0].type === "text" ? response.content[0].text.trim() : "";
}

/**
 * Analiza el texto de respuesta de un cliente y devuelve el sentimiento detectado.
 * Usa claude-sonnet-4-6; el JSON estructurado fuerza salida determinista.
 *
 * @throws Si la respuesta de Claude no es un JSON válido con la estructura esperada
 */
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

  const rawText = response.content[0].type === "text" ? response.content[0].text : "";
  return parseClaudeJson<SentimentResult>(rawText, "analyzeSentiment");
}

// ---------------------------------------------------------------------------
// Shared prompts used by Google Business route handlers
// ---------------------------------------------------------------------------

export const ANALYSIS_SYSTEM_PROMPT = `Eres un experto en análisis de reputación online para negocios locales.
Analiza el conjunto de reseñas de Google proporcionadas y genera un informe estructurado.

Responde SIEMPRE con un JSON válido con esta estructura exacta:
{
  "overallSentiment": "string breve describiendo el sentimiento general (ej: 'Muy positivo', 'Mixto', 'Mayormente negativo')",
  "averageRating": número con un decimal,
  "reviewCount": número entero,
  "ratingTrend": "string describiendo la tendencia (ej: 'Las últimas reseñas son más positivas que las antiguas')",
  "topPraises": ["elogio 1", "elogio 2", "elogio 3"],
  "topComplaints": ["queja 1", "queja 2", "queja 3"],
  "profileSuggestions": ["sugerencia 1", "sugerencia 2", "sugerencia 3", "sugerencia 4"]
}

Los arrays deben tener entre 2 y 5 elementos.
Las sugerencias de perfil deben ser accionables y específicas para mejorar la presencia en Google Business.
Si hay pocas reseñas o no hay quejas/elogios claros, indícalo brevemente en el campo correspondiente.`;

export const REPLY_SYSTEM_PROMPT = `Eres un experto en gestión de reputación online para negocios locales.
Tu tarea es generar respuestas profesionales y personalizadas a reseñas de Google Business.

Reglas:
1. La respuesta debe ser en español.
2. Comienza agradeciendo al cliente por su reseña.
3. Para reseñas positivas: muestra entusiasmo genuino y anima a volver.
4. Para reseñas negativas: muestra empatía, pide disculpas y ofrece solución o contacto directo.
5. Para reseñas neutrales: agradece el feedback y menciona que trabajáis para mejorar.
6. Usa el nombre del cliente si está disponible (no "Estimado usuario").
7. Firma siempre con el nombre del negocio.
8. Longitud: 3-5 frases. No uses emojis excesivos.
9. Aplica el tono indicado: tuteo, usted, o juvenil.

Responde SOLO con el texto de la respuesta, sin explicaciones adicionales.`;
