/**
 * GET /api/google-business/analyze
 *
 * Fetches all reviews and uses Claude to generate a structured analysis:
 * sentiment patterns, top complaints, top praises, profile improvement suggestions.
 */

import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  getReviews,
  getValidAccessToken,
  starRatingToNumber,
} from "@/lib/google-business";
import { anthropic, parseClaudeJson, ANALYSIS_SYSTEM_PROMPT } from "@/lib/claude";
import { logger } from "@/lib/logger";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // 2 full analyses per 10 minutes per user (fetches Google API + runs Claude)
  const serviceClient = await createServiceClient();
  const rl = await checkGeneralRateLimit(serviceClient, `gb-analyze:${user.id}`, 10, 2);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Espera unos minutos." }, { status: 429 });
  }

  const { data: business, error: bizError } = await supabase
    .from("businesses")
    .select(
      "id, name, google_access_token, google_refresh_token, google_token_expiry, google_location_name"
    )
    .eq("user_id", user.id)
    .single();

  if (bizError || !business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  if (!business.google_access_token || !business.google_location_name) {
    return NextResponse.json(
      { error: "Google Business no conectado", connected: false },
      { status: 200 }
    );
  }

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(business as {
      google_access_token: string;
      google_refresh_token: string | null;
      google_token_expiry: string | null;
      id: string;
    });
  } catch (err) {
    logger.error("[GoogleBusiness] Error al renovar token para análisis", err);
    return NextResponse.json({ error: "Token expirado, reconecta Google Business" }, { status: 401 });
  }

  let reviews;
  try {
    reviews = await getReviews(accessToken, business.google_location_name as string);
  } catch (err) {
    logger.error("[GoogleBusiness] Error al obtener reseñas para análisis", err);
    return NextResponse.json(
      { error: "Error al obtener reseñas de Google" },
      { status: 502 }
    );
  }

  if (reviews.length === 0) {
    return NextResponse.json({
      analysis: {
        overallSentiment: "Sin reseñas",
        averageRating: 0,
        reviewCount: 0,
        ratingTrend: "No hay suficientes datos",
        topPraises: ["No hay elogios registrados aún"],
        topComplaints: ["No hay quejas registradas aún"],
        profileSuggestions: [
          "Solicita reseñas a tus clientes para obtener más visibilidad",
          "Completa todos los campos de tu perfil de Google Business",
          "Añade fotos de calidad de tu negocio",
          "Responde a todas las reseñas para mejorar el engagement",
        ],
      },
    });
  }

  // Build review text for Claude
  const reviewTexts = reviews.map((r) => {
    const stars = starRatingToNumber(r.starRating);
    const comment = r.comment ?? "(sin comentario)";
    return `[${stars}★] ${r.reviewer.displayName}: ${comment}`;
  });

  const prompt = `Analiza estas ${reviews.length} reseñas de Google Business para "${business.name}":\n\n${reviewTexts.join("\n")}`;

  let analysis;
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    const rawText = response.content[0].type === "text" ? response.content[0].text : "{}";
    analysis = parseClaudeJson(rawText, "gb-analyze");
  } catch (err) {
    logger.error("[GoogleBusiness] Error en análisis de Claude", err);
    return NextResponse.json({ error: "Error al analizar las reseñas" }, { status: 500 });
  }

  return NextResponse.json({ analysis });
}
