/**
 * POST /api/google-business/suggest-reply
 *
 * Uses Claude to generate a suggested reply to a Google review.
 *
 * Body: { reviewerName, reviewText, rating, businessName, tone }
 * Returns: { suggestion: string }
 */

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { anthropic, REPLY_SYSTEM_PROMPT } from "@/lib/claude";
import { logger } from "@/lib/logger";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

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
