import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { logger } from "@/lib/logger";
import type {
  ReportTheme,
  ReportImprovementIdea,
  ReportSentimentSummary,
  ReportPlatformComparison,
  ReportStarsCalculator,
  ReportFrequencyRecommendation,
} from "@/types";

// ── Stars calculator ──────────────────────────────────────────────────────────
// Google displays ratings rounded to 1 decimal. To jump from R to R+0.1,
// the actual average must reach (R+0.1) - 0.05 = R+0.05.
// Solving: (R*N + 5*x) / (N+x) >= R+0.05  →  x = ceil(N*0.05 / (5-(R+0.05)))
function computeStarsCalculator(
  rating: number | null,
  reviewCount: number | null,
): ReportStarsCalculator {
  if (!rating || !reviewCount) {
    return { current_rating: rating, current_review_count: reviewCount, five_stars_needed_for_next: null, next_target_rating: null };
  }
  if (rating >= 5.0) {
    return { current_rating: rating, current_review_count: reviewCount, five_stars_needed_for_next: 0, next_target_rating: 5.0 };
  }

  const nextTarget   = Math.min(5.0, Math.round((rating + 0.1) * 10) / 10);
  const actualTarget = nextTarget - 0.049; // just inside the next display bracket
  const needed       = Math.ceil(reviewCount * (actualTarget - rating) / (5 - actualTarget));

  return {
    current_rating:             rating,
    current_review_count:       reviewCount,
    five_stars_needed_for_next: Math.max(1, needed),
    next_target_rating:         nextTarget,
  };
}

// ── Frequency recommendation ─────────────────────────────────────────────────
function computeFrequencyRecommendation(
  requestDates: string[],
  positiveRate:  number, // 0–100
): ReportFrequencyRecommendation {
  const now      = new Date();
  const sixMoAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const recent   = requestDates.filter((d) => new Date(d) >= sixMoAgo);

  const monthsElapsed = Math.max(
    1,
    (now.getFullYear() - sixMoAgo.getFullYear()) * 12 +
    (now.getMonth()   - sixMoAgo.getMonth())   + 1,
  );

  const avgMonthly     = Math.round(recent.length / monthsElapsed);
  const conversionRate = positiveRate / 100;

  // Target: at least 10 positive reviews per month (good for local SEO freshness).
  // If current volume is higher, target 30% more than the current positive yield.
  const currentPositivePerMonth = Math.round(avgMonthly * conversionRate);
  const targetPositivePerMonth  = Math.max(10, Math.ceil(currentPositivePerMonth * 1.3));
  const recommendedMonthly      = conversionRate > 0
    ? Math.ceil(targetPositivePerMonth / conversionRate)
    : Math.max(avgMonthly * 2, 50);

  const reasoning = conversionRate >= 0.5
    ? `Tu tasa de conversión es alta (${Math.round(conversionRate * 100)}%). Con ${recommendedMonthly} solicitudes al mes obtendrías ~${targetPositivePerMonth} reseñas positivas nuevas, suficiente para mantener la frecuencia que Google Maps prioriza en los resultados locales.`
    : `Google Maps favorece los negocios con reseñas recientes y frecuentes. Con ${recommendedMonthly} solicitudes al mes y tu tasa de conversión actual (~${Math.round(conversionRate * 100)}%) obtendrías ~${targetPositivePerMonth} reseñas positivas publicadas cada mes.`;

  return {
    current_monthly_avg_requests: avgMonthly,
    conversion_rate:              Math.round(conversionRate * 100),
    recommended_monthly_target:   recommendedMonthly,
    recommended_weekly_target:    Math.ceil(recommendedMonthly / 4),
    reasoning,
  };
}

// ── Claude analysis ──────────────────────────────────────────────────────────
interface ClaudeAnalysisResult {
  positive_themes:   ReportTheme[];
  negative_themes:   ReportTheme[];
  improvement_ideas: ReportImprovementIdea[];
}

async function analyzeWithClaude(
  reviews:      Array<{ customer_response: string; status: string }>,
  businessName: string,
): Promise<ClaudeAnalysisResult> {
  const anthropic = new Anthropic();

  const reviewLines = reviews
    .map((r, i) => `[${i + 1}] (${r.status}): "${r.customer_response}"`)
    .join("\n");

  const response = await anthropic.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 2500,
    messages: [{
      role:    "user",
      content: `Analiza el siguiente feedback de clientes recibido por WhatsApp para el negocio "${businessName}".

RESPUESTAS DE CLIENTES (${reviews.length} en total):
${reviewLines}

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura exacta:
{
  "positive_themes": [
    { "theme": "máx 5 palabras en español", "count": número_de_respuestas_relacionadas, "examples": ["cita textual 1", "cita textual 2"] }
  ],
  "negative_themes": [
    { "theme": "máx 5 palabras en español", "count": número_de_respuestas_relacionadas, "examples": ["cita textual 1", "cita textual 2"] }
  ],
  "improvement_ideas": [
    { "title": "Acción concreta en español", "description": "2-3 frases explicando la mejora", "based_on_count": número, "example_comments": ["cita textual"] }
  ]
}

Reglas:
- 3-5 temas positivos, 2-4 temas negativos, 3-4 ideas de mejora (si hay suficiente feedback negativo/neutral)
- Las citas deben ser palabras exactas del cliente (máx 2 por tema)
- Todo en español; ordena por frecuencia descendente
- Ideas de mejora solo basadas en feedback negativo o neutral
- Solo JSON, sin texto adicional antes ni después`,
    }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Claude returned non-text content");

  // Strip possible markdown code fences
  const jsonStr = content.text.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(jsonStr) as ClaudeAnalysisResult;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: "No autorizado" }, { status: 401 });

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("user_id", user.id)
    .single();

  if (!business) return Response.json({ error: "Negocio no encontrado" }, { status: 404 });

  const periodEnd   = new Date();
  const periodStart = new Date(periodEnd);
  periodStart.setMonth(periodStart.getMonth() - 6);

  // Fetch all data in parallel
  const [reviewsResult, snapshotResult, allDatesResult] = await Promise.all([
    supabase
      .from("review_requests")
      .select("customer_response, status, sentiment_score")
      .eq("business_id", business.id)
      .not("customer_response", "is", null)
      .gte("created_at", periodStart.toISOString())
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("google_maps_snapshots")
      .select("rating, review_count")
      .eq("business_id", business.id)
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("review_requests")
      .select("created_at")
      .eq("business_id", business.id)
      .gte("created_at", periodStart.toISOString()),
  ]);

  const reviews  = reviewsResult.data  ?? [];
  const snapshot = snapshotResult.data ?? null;
  const allDates = (allDatesResult.data ?? []).map((r) => r.created_at);

  // ── Sentiment summary ────────────────────────────────────────────────────
  const positives = reviews.filter((r) =>
    ["positive", "awaiting_screenshot", "rewarded"].includes(r.status),
  );
  const negatives = reviews.filter((r) => r.status === "negative");
  const neutrals  = reviews.filter((r) => r.status === "neutral");
  const avgScore  = reviews.length > 0
    ? reviews.reduce((s, r) => s + (r.sentiment_score ?? 0.5), 0) / reviews.length
    : 0;

  const sentimentSummary: ReportSentimentSummary = {
    total_analyzed: reviews.length,
    positive_count: positives.length,
    negative_count: negatives.length,
    neutral_count:  neutrals.length,
    avg_score:      Math.round(avgScore * 100) / 100,
  };

  const positiveRate = reviews.length > 0
    ? Math.round((positives.length / reviews.length) * 100)
    : 0;

  // ── Platform comparison ──────────────────────────────────────────────────
  const whatsappScore = (positiveRate / 100) * 5;
  let gapDescription  = "Sin datos de plataforma disponibles aún.";
  if (snapshot?.rating) {
    const gap = snapshot.rating - whatsappScore;
    if (gap > 0.3) {
      gapDescription = `Las reseñas publicadas en Google Maps (${snapshot.rating}★) son ${gap.toFixed(1)} puntos más altas que el feedback privado (${whatsappScore.toFixed(1)}/5). Es normal: los clientes muy satisfechos publican y los insatisfechos no lo hacen, lo que infla la media pública.`;
    } else if (gap < -0.3) {
      gapDescription = `El feedback privado (${whatsappScore.toFixed(1)}/5) supera la media pública de Google Maps (${snapshot.rating}★). Hay clientes satisfechos que no están llegando a publicar su reseña — aumentar los envíos puede cerrar esa brecha.`;
    } else {
      gapDescription = `El feedback privado (${whatsappScore.toFixed(1)}/5) y las reseñas públicas (${snapshot.rating}★) están alineados. Los clientes satisfechos sí están llegando a publicar.`;
    }
  }

  const platformComparison: ReportPlatformComparison = {
    whatsapp_positive_rate: positiveRate,
    platform_rating:        snapshot?.rating       ?? null,
    platform_review_count:  snapshot?.review_count ?? null,
    gap_description:        gapDescription,
  };

  const starsCalculator        = computeStarsCalculator(snapshot?.rating ?? null, snapshot?.review_count ?? null);
  const frequencyRecommendation = computeFrequencyRecommendation(allDates, positiveRate);

  // ── AI themes & improvement ideas ───────────────────────────────────────
  let positiveThemes:   ReportTheme[]           = [];
  let negativeThemes:   ReportTheme[]           = [];
  let improvementIdeas: ReportImprovementIdea[] = [];

  if (reviews.length >= 3) {
    try {
      const aiResult = await analyzeWithClaude(
        reviews as Array<{ customer_response: string; status: string }>,
        business.name,
      );
      positiveThemes   = aiResult.positive_themes   ?? [];
      negativeThemes   = aiResult.negative_themes   ?? [];
      improvementIdeas = aiResult.improvement_ideas ?? [];
    } catch (err) {
      logger.error("Error en análisis IA del informe", err);
    }
  }

  // ── Persist report ───────────────────────────────────────────────────────
  const { data: report, error } = await supabase
    .from("business_reports")
    .insert({
      business_id:              business.id,
      period_start:             periodStart.toISOString(),
      period_end:               periodEnd.toISOString(),
      total_analyzed:           reviews.length,
      sentiment_summary:        sentimentSummary,
      positive_themes:          positiveThemes,
      negative_themes:          negativeThemes,
      improvement_ideas:        improvementIdeas,
      platform_comparison:      platformComparison,
      stars_calculator:         starsCalculator,
      frequency_recommendation: frequencyRecommendation,
    })
    .select()
    .single();

  if (error) {
    logger.error("Error guardando informe", error);
    return Response.json({ error: "Error guardando informe" }, { status: 500 });
  }

  logger.info(`Informe generado para negocio ${business.id}: ${reviews.length} respuestas analizadas`);
  return Response.json({ success: true, data: report });
}
