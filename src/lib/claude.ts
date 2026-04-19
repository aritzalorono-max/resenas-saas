import Anthropic from "@anthropic-ai/sdk";
import type { SentimentResult } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `Eres un analizador de opiniones de clientes para negocios locales.
Tu tarea es analizar el texto de la respuesta de un cliente y determinar si es positiva, negativa o neutral.

Responde SIEMPRE con un JSON válido con esta estructura exacta:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": número entre 0.0 y 1.0 (donde 1.0 es la máxima positividad),
  "summary": "breve resumen de la opinión en español (máximo 100 caracteres)"
}

Criterios:
- "positive": el cliente está satisfecho, recomienda el servicio, usa palabras positivas
- "negative": el cliente está insatisfecho, tiene quejas, usa palabras negativas
- "neutral": el cliente no expresa una opinión clara o es ambigua

Sé estricto: si el cliente usa palabras como "bien", "estuvo ok", "normal" — es neutral.
Solo "positive" si hay claramente satisfacción.`;

export async function analyzeSentiment(
  customerResponse: string
): Promise<SentimentResult> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analiza esta respuesta del cliente: "${customerResponse}"`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const result = JSON.parse(text) as SentimentResult;
  return result;
}

export function buildPositiveFollowUp(
  customerName: string,
  businessName: string,
  googleMapsUrl: string
): string {
  return `¡Qué alegría saber eso, ${customerName}! 🙌 Nos encanta que hayas tenido una buena experiencia en ${businessName}.

¿Te animarías a dejar tu opinión en Google Maps? Con solo un minuto de tu tiempo ayudarías a más personas a encontrarnos:

👉 ${googleMapsUrl}

¡Muchas gracias de corazón! 💚`;
}

export function buildNegativeFollowUp(customerName: string, businessName: string): string {
  return `Gracias por tu honestidad, ${customerName}. Lamentamos que tu experiencia no haya sido la que esperabas 😔

En ${businessName} tomamos muy en serio cada opinión. Si quieres contarnos qué ocurrió para poder mejorar, no dudes en responder a este mensaje.

Tu opinión es muy valiosa para nosotros. ¡Esperamos poder verte pronto y darte la experiencia que mereces! 🙏`;
}

export function buildNeutralFollowUp(
  customerName: string,
  businessName: string,
  googleMapsUrl: string
): string {
  return `Gracias por tu respuesta, ${customerName}! 😊 Nos alegra que hayas pasado por ${businessName}.

Si quieres compartir tu experiencia en Google Maps, nos ayudaría mucho:

👉 ${googleMapsUrl}

¡Hasta pronto! 💚`;
}
