import Anthropic from "@anthropic-ai/sdk";
import type { BusinessTone, SentimentResult } from "@/types";

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

// ─── Follow-up message builders by tone ──────────────────────────────────────

export function buildPositiveFollowUp(
  customerName: string,
  businessName: string,
  googleMapsUrl: string,
  tone: BusinessTone = "tuteo"
): string {
  if (tone === "usted") {
    return `¡Qué alegría saber eso, ${customerName}! 🙌 Nos encanta que haya tenido una buena experiencia en ${businessName}.

¿Se animaría a dejar su opinión en Google Maps? Con solo un minuto de su tiempo ayudaría a más personas a encontrarnos:

👉 ${googleMapsUrl}

¡Muchas gracias de corazón! 💚`;
  }

  if (tone === "juvenil") {
    return `¡Genial, ${customerName}! 🔥 ¡Nos alegra un montón que te haya ido bien en ${businessName}!

¿Nos echas una mano dejando una reseña en Google? ¡Nos ayuda muchísimo! 🙏

👉 ${googleMapsUrl}

¡Eres lo más! 💚✨`;
  }

  // tuteo (default)
  return `¡Qué alegría saber eso, ${customerName}! 🙌 Nos encanta que hayas tenido una buena experiencia en ${businessName}.

¿Te animarías a dejar tu opinión en Google Maps? Con solo un minuto de tu tiempo ayudarías a más personas a encontrarnos:

👉 ${googleMapsUrl}

¡Muchas gracias de corazón! 💚`;
}

export function buildNegativeFollowUp(
  customerName: string,
  businessName: string,
  tone: BusinessTone = "tuteo"
): string {
  if (tone === "usted") {
    return `Gracias por su honestidad, ${customerName}. Lamentamos que su experiencia no haya sido la que esperaba 😔

En ${businessName} tomamos muy en serio cada opinión. Si quiere contarnos qué ocurrió para poder mejorar, no dude en responder a este mensaje.

Su opinión es muy valiosa para nosotros. ¡Esperamos poder atenderle pronto y darle la experiencia que merece! 🙏`;
  }

  if (tone === "juvenil") {
    return `Vaya, ${customerName}, nos sabe muy mal que no haya ido bien 😕

En ${businessName} queremos mejorar y tu opinión nos ayuda un montón. ¿Nos cuentas qué pasó? 💬

¡Ojalá podamos verte pronto y darte una experiencia mucho mejor! 🙌`;
  }

  // tuteo (default)
  return `Gracias por tu honestidad, ${customerName}. Lamentamos que tu experiencia no haya sido la que esperabas 😔

En ${businessName} tomamos muy en serio cada opinión. Si quieres contarnos qué ocurrió para poder mejorar, no dudes en responder a este mensaje.

Tu opinión es muy valiosa para nosotros. ¡Esperamos poder verte pronto y darte la experiencia que mereces! 🙏`;
}

export function buildNeutralFollowUp(
  customerName: string,
  businessName: string,
  googleMapsUrl: string,
  tone: BusinessTone = "tuteo"
): string {
  if (tone === "usted") {
    return `Gracias por su respuesta, ${customerName} 😊 Nos alegra que haya pasado por ${businessName}.

Si quiere compartir su experiencia en Google Maps, nos ayudaría mucho:

👉 ${googleMapsUrl}

¡Hasta pronto! 💚`;
  }

  if (tone === "juvenil") {
    return `¡Gracias por responder, ${customerName}! 😊 ¡Mola que hayas pasado por ${businessName}!

Si te apetece, puedes dejar tu opinión en Google, ¡nos ayuda un montón!

👉 ${googleMapsUrl}

¡Nos vemos pronto! 🙌`;
  }

  // tuteo (default)
  return `Gracias por tu respuesta, ${customerName} 😊 Nos alegra que hayas pasado por ${businessName}.

Si quieres compartir tu experiencia en Google Maps, nos ayudaría mucho:

👉 ${googleMapsUrl}

¡Hasta pronto! 💚`;
}
