/**
 * POST /api/google-business/suggest-reply
 *
 * Uses Claude to generate a suggested reply to a Google review.
 *
 * Body: { reviewerName, reviewText, rating, businessName, tone }
 * Returns: { suggestion: string }
 */

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const REPLY_SYSTEM_PROMPT = `Eres un experto en gestión de reputación online para negocios locales.
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

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // 10 AI suggestions per minute per user
  const serviceClient = await createServiceClient();
  const rl = await checkGeneralRateLimit(serviceClient, `suggest-reply:${user.id}`, 1, 10);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Espera un momento." }, { status: 429 });
  }

  let body: {
    reviewerName?: string;
    reviewText?: string;
    rating?: number;
    businessName?: string;
    tone?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const reviewerName = typeof body.reviewerName === "string" ? body.reviewerName.trim().slice(0, 200) : undefined;
  const reviewText   = typeof body.reviewText   === "string" ? body.reviewText.trim().slice(0, 4096)  : undefined;
  const businessName = typeof body.businessName === "string" ? body.businessName.trim().slice(0, 200)  : "";
  const tone         = typeof body.tone         === "string" ? body.tone : undefined;
  const ratingRaw    = body.rating;
  const rating       = typeof ratingRaw === "number" ? ratingRaw : Number(ratingRaw);

  if (!businessName || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Se requieren rating (1–5) y businessName" },
      { status: 400 }
    );
  }

  const toneInstruction =
    tone === "usted"
      ? "Usa el tratamiento de 'usted' (formal)."
      : tone === "juvenil"
      ? "Usa un tono informal y cercano (tuteo juvenil)."
      : "Usa el tuteo (tono informal amigable).";

  const prompt = `
Negocio: ${businessName}
Tono: ${toneInstruction}
Reviewer: ${reviewerName ?? "Cliente"}
Puntuación: ${rating} de 5 estrellas
Reseña: ${reviewText ?? "(sin comentario)"}

Genera una respuesta apropiada para esta reseña.`.trim();

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: REPLY_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const suggestion =
      response.content[0].type === "text"
        ? response.content[0].text.trim()
        : "";

    logger.info("[GoogleBusiness] Sugerencia de respuesta generada");
    return NextResponse.json({ suggestion });
  } catch (err) {
    logger.error("[GoogleBusiness] Error al generar sugerencia de respuesta", err);
    return NextResponse.json(
      { error: "Error al generar la sugerencia" },
      { status: 500 }
    );
  }
}
