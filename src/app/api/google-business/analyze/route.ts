/**
 * GET /api/google-business/analyze
 *
 * Fetches all reviews and uses Claude to generate a structured analysis:
 * sentiment patterns, top complaints, top praises, profile improvement suggestions.
 */

import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  getReviews,
  refreshAccessToken,
  starRatingToNumber,
} from "@/lib/google-business";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const ANALYSIS_SYSTEM_PROMPT = `Eres un experto en análisis de reputación online para negocios locales.
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

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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

  // Refresh token if needed
  let accessToken = business.google_access_token as string;
  const expiryDate = business.google_token_expiry
    ? new Date(business.google_token_expiry as string)
    : null;
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

  if ((!expiryDate || expiryDate <= fiveMinutesFromNow) && business.google_refresh_token) {
    try {
      const refreshed = await refreshAccessToken(business.google_refresh_token as string);
      accessToken = refreshed.access_token;
      const serviceClient = await createServiceClient();
      await serviceClient
        .from("businesses")
        .update({
          google_access_token: refreshed.access_token,
          google_token_expiry: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
        })
        .eq("id", business.id);
    } catch (err) {
      logger.error("[GoogleBusiness] Error al renovar token para análisis", err);
      return NextResponse.json({ error: "Token expirado, reconecta Google Business" }, { status: 401 });
    }
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

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    analysis = JSON.parse(cleaned);
  } catch (err) {
    logger.error("[GoogleBusiness] Error en análisis de Claude", err);
    return NextResponse.json(
      { error: "Error al analizar las reseñas" },
      { status: 500 }
    );
  }

  return NextResponse.json({ analysis });
}
