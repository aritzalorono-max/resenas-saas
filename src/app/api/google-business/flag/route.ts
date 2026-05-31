/**
 * POST /api/google-business/flag
 *
 * Flags a problematic review. Uses Claude to generate a professional
 * complaint email to Google, then saves the flag to DB.
 *
 * Body: { reviewName, reviewerName, reviewText, rating, flagReason }
 * Returns: { complaintText: string }
 */

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const FLAG_SYSTEM_PROMPT = `Eres un experto en políticas de contenido de Google Business Profile.
Tu tarea es redactar correos electrónicos de reclamación profesionales para solicitar la eliminación de reseñas que infringen las políticas de Google.

Las políticas de Google que pueden justificar la eliminación de una reseña incluyen:
- Spam o contenido falso
- Contenido fuera de tema o irrelevante
- Contenido restringido (lenguaje ofensivo, acoso, discurso de odio)
- Conflicto de interés (reseñas de ex empleados, competidores)
- Información personal o privada

Genera un correo en ESPAÑOL, profesional y conciso, dirigido a Google Business Profile Support.
Incluye: descripción del problema, política específica infringida, y solicitud clara de eliminación.

Responde SOLO con el texto del correo electrónico, sin explicaciones adicionales.`;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // 5 flag+AI complaint generations per minute per user
  const serviceClient = await createServiceClient();
  const rl = await checkGeneralRateLimit(serviceClient, `gb-flag:${user.id}`, 1, 5);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Espera un momento." }, { status: 429 });
  }

  let body: {
    reviewName?: string;
    reviewerName?: string;
    reviewText?: string;
    rating?: number;
    flagReason?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const reviewName   = typeof body.reviewName   === "string" ? body.reviewName.trim().slice(0, 500)   : "";
  const reviewerName = typeof body.reviewerName === "string" ? body.reviewerName.trim().slice(0, 200)  : undefined;
  const reviewText   = typeof body.reviewText   === "string" ? body.reviewText.trim().slice(0, 4096)   : undefined;
  const flagReason   = typeof body.flagReason   === "string" ? body.flagReason.trim().slice(0, 1000)   : "";
  const ratingRaw    = body.rating;
  const rating       = typeof ratingRaw === "number" ? ratingRaw : (ratingRaw !== undefined ? Number(ratingRaw) : undefined);

  if (!reviewName || !flagReason) {
    return NextResponse.json(
      { error: "Se requieren reviewName y flagReason" },
      { status: 400 }
    );
  }

  if (rating !== undefined && (!Number.isFinite(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: "El rating debe estar entre 1 y 5" }, { status: 400 });
  }

  // Get business info
  const { data: business, error: bizError } = await supabase
    .from("businesses")
    .select("id, name, google_location_name")
    .eq("user_id", user.id)
    .single();

  if (bizError || !business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  const prompt = `
Negocio afectado: ${business.name}
Perfil de Google Business: ${business.google_location_name ?? "No disponible"}
Autor de la reseña: ${reviewerName ?? "Usuario anónimo"}
Puntuación: ${rating ?? "Sin especificar"} de 5 estrellas
Texto de la reseña: ${reviewText ?? "(sin comentario)"}
Motivo de la reclamación: ${flagReason}

Redacta el correo de reclamación a Google.`.trim();

  let complaintText: string;
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: FLAG_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    complaintText =
      response.content[0].type === "text"
        ? response.content[0].text.trim()
        : "";
  } catch (err) {
    logger.error("[GoogleBusiness] Error al generar email de reclamación", err);
    return NextResponse.json(
      { error: "Error al generar el correo de reclamación" },
      { status: 500 }
    );
  }

  // Save flag to DB
  const { error: saveError } = await supabase
    .from("google_review_flags")
    .upsert(
      {
        business_id: business.id,
        review_name: reviewName,
        reviewer_name: reviewerName ?? null,
        review_text: reviewText ?? null,
        flag_reason: flagReason,
        complaint_email_text: complaintText,
        flagged_at: new Date().toISOString(),
        status: "pending",
      },
      { onConflict: "review_name" }
    );

  if (saveError) {
    logger.warn("[GoogleBusiness] Error al guardar flag en BD", saveError);
  }

  logger.info("[GoogleBusiness] Reseña marcada como problemática", { reviewName });
  return NextResponse.json({ complaintText, success: true });
}
