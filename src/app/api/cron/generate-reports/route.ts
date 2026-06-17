import { timingSafeEqual } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
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

export const runtime    = "nodejs";
export const maxDuration = 300; // 5 min — processing all businesses

function computeStarsCalculator(rating: number | null, reviewCount: number | null): ReportStarsCalculator {
  if (!rating || !reviewCount) return { current_rating: rating, current_review_count: reviewCount, five_stars_needed_for_next: null, next_target_rating: null };
  if (rating >= 5.0) return { current_rating: rating, current_review_count: reviewCount, five_stars_needed_for_next: 0, next_target_rating: 5.0 };
  const nextTarget   = Math.min(5.0, Math.round((rating + 0.1) * 10) / 10);
  const actualTarget = nextTarget - 0.049;
  const needed       = Math.ceil(reviewCount * (actualTarget - rating) / (5 - actualTarget));
  return { current_rating: rating, current_review_count: reviewCount, five_stars_needed_for_next: Math.max(1, needed), next_target_rating: nextTarget };
}

function computeFrequencyRecommendation(requestDates: string[], positiveRate: number): ReportFrequencyRecommendation {
  const now      = new Date();
  const sixMoAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const recent   = requestDates.filter((d) => new Date(d) >= sixMoAgo);
  const months   = Math.max(1, (now.getFullYear() - sixMoAgo.getFullYear()) * 12 + (now.getMonth() - sixMoAgo.getMonth()) + 1);
  const avg      = Math.round(recent.length / months);
  const conv     = positiveRate / 100;
  const target   = Math.max(10, Math.ceil(avg * conv * 1.3));
  const monthly  = conv > 0 ? Math.ceil(target / conv) : Math.max(avg * 2, 50);
  return {
    current_monthly_avg_requests: avg,
    conversion_rate:              Math.round(conv * 100),
    recommended_monthly_target:   monthly,
    recommended_weekly_target:    Math.ceil(monthly / 4),
    reasoning:                    `Con ${monthly} solicitudes al mes obtendrías ~${target} reseñas positivas nuevas, manteniendo la frecuencia que Google Maps prioriza en resultados locales.`,
  };
}

async function analyzeWithClaude(reviews: Array<{ customer_response: string; status: string }>, businessName: string): Promise<{ positive_themes: ReportTheme[]; negative_themes: ReportTheme[]; improvement_ideas: ReportImprovementIdea[] }> {
  const anthropic  = new Anthropic();
  const reviewLines = reviews.map((r, i) => `[${i + 1}] (${r.status}): "${r.customer_response}"`).join("\n");
  // Sanitize businessName to prevent prompt injection via control characters or newlines
  const safeName = businessName.replace(/[\n\r\t\x00-\x1F\x7F]/g, " ").trim().slice(0, 200);
  const response   = await anthropic.messages.create({
    model: "claude-sonnet-4-6", max_tokens: 2500,
    messages: [{ role: "user", content: `Analiza el feedback de clientes de "${safeName}" y devuelve SOLO JSON:\n\n${reviewLines}\n\n{"positive_themes":[{"theme":"","count":0,"examples":[]}],"negative_themes":[{"theme":"","count":0,"examples":[]}],"improvement_ideas":[{"title":"","description":"","based_on_count":0,"example_comments":[]}]}` }],
  });
  const content = response.content[0];
  if (content.type !== "text") throw new Error("Non-text response");
  const jsonStr = content.text.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    logger.error("analyzeWithClaude: respuesta de Claude no es JSON válido", err);
    throw new Error("No se pudo analizar la respuesta de la IA");
  }
}

async function generateForBusiness(
  bizId: string, bizName: string,
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  periodStart: Date, periodEnd: Date,
): Promise<"ok" | "skip" | "error"> {
  try {
    const [reviewsResult, snapshotResult, datesResult] = await Promise.all([
      supabase.from("review_requests").select("customer_response, status, sentiment_score").eq("business_id", bizId).not("customer_response", "is", null).gte("created_at", periodStart.toISOString()).order("created_at", { ascending: false }).limit(200),
      supabase.from("google_maps_snapshots").select("rating, review_count").eq("business_id", bizId).order("fetched_at", { ascending: false }).limit(1).single(),
      // Cap at 5 000 rows — computeFrequencyRecommendation only needs a sample for monthly averages
      supabase.from("review_requests").select("created_at").eq("business_id", bizId).gte("created_at", periodStart.toISOString()).limit(5000),
    ]);

    const reviews  = reviewsResult.data  ?? [];
    const snapshot = snapshotResult.data ?? null;
    const dates    = (datesResult.data   ?? []).map((r) => r.created_at);

    if (reviews.length === 0 && !snapshot) return "skip";

    const positives    = reviews.filter((r) => ["positive", "awaiting_screenshot", "rewarded"].includes(r.status));
    const negatives    = reviews.filter((r) => r.status === "negative");
    const neutrals     = reviews.filter((r) => r.status === "neutral");
    const avgScore     = reviews.length > 0 ? reviews.reduce((s, r) => s + (r.sentiment_score ?? 0.5), 0) / reviews.length : 0;
    const positiveRate = reviews.length > 0 ? Math.round((positives.length / reviews.length) * 100) : 0;

    const sentimentSummary: ReportSentimentSummary = { total_analyzed: reviews.length, positive_count: positives.length, negative_count: negatives.length, neutral_count: neutrals.length, avg_score: Math.round(avgScore * 100) / 100 };

    const wsScore = (positiveRate / 100) * 5;
    const gap     = snapshot?.rating ? snapshot.rating - wsScore : 0;
    const platformComparison: ReportPlatformComparison = {
      whatsapp_positive_rate: positiveRate,
      platform_rating:        snapshot?.rating       ?? null,
      platform_review_count:  snapshot?.review_count ?? null,
      gap_description:        !snapshot?.rating ? "Sin datos de plataforma disponibles." :
        gap > 0.3  ? `Las reseñas públicas (${snapshot.rating}★) superan el feedback privado (${wsScore.toFixed(1)}/5) — los clientes satisfechos publican mientras los insatisfechos no lo hacen.` :
        gap < -0.3 ? `El feedback privado (${wsScore.toFixed(1)}/5) supera las reseñas públicas (${snapshot.rating}★) — hay clientes satisfechos que no están llegando a publicar.` :
        `Feedback privado (${wsScore.toFixed(1)}/5) y reseñas públicas (${snapshot.rating}★) están alineados.`,
    };

    let positiveThemes: ReportTheme[] = [], negativeThemes: ReportTheme[] = [], improvementIdeas: ReportImprovementIdea[] = [];
    if (reviews.length >= 3) {
      try {
        const ai   = await analyzeWithClaude(reviews as Array<{ customer_response: string; status: string }>, bizName);
        positiveThemes   = ai.positive_themes   ?? [];
        negativeThemes   = ai.negative_themes   ?? [];
        improvementIdeas = ai.improvement_ideas ?? [];
      } catch (e) { logger.error(`Error IA para negocio ${bizId}`, e); }
    }

    await supabase.from("business_reports").insert({
      business_id: bizId, period_start: periodStart.toISOString(), period_end: periodEnd.toISOString(),
      total_analyzed: reviews.length, sentiment_summary: sentimentSummary,
      positive_themes: positiveThemes, negative_themes: negativeThemes, improvement_ideas: improvementIdeas,
      platform_comparison: platformComparison,
      stars_calculator: computeStarsCalculator(snapshot?.rating ?? null, snapshot?.review_count ?? null),
      frequency_recommendation: computeFrequencyRecommendation(dates, positiveRate),
    });

    return "ok";
  } catch (e) {
    logger.error(`Error generando informe para ${bizId}`, e);
    return "error";
  }
}

export async function GET(request: Request): Promise<Response> {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${cronSecret ?? ""}`;
  const valid = cronSecret && auth.length === expected.length &&
    timingSafeEqual(Buffer.from(auth), Buffer.from(expected));
  if (!valid) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase     = await createServiceClient();
  const periodEnd    = new Date();
  const periodStart  = new Date(periodEnd);
  periodStart.setMonth(periodStart.getMonth() - 6);

  const { data: businesses } = await supabase.from("businesses").select("id, name").limit(10000);
  if (!businesses?.length) return Response.json({ ok: true, processed: 0 });

  let ok = 0, skipped = 0, errors = 0;
  // Process sequentially to avoid overwhelming Claude API quota
  for (const biz of businesses) {
    const result = await generateForBusiness(biz.id, biz.name, supabase, periodStart, periodEnd);
    if (result === "ok")    ok++;
    if (result === "skip")  skipped++;
    if (result === "error") errors++;
  }

  logger.info(`Cron informes: ${ok} ok, ${skipped} saltados, ${errors} errores`);
  return Response.json({ ok: true, processed: ok, skipped, errors });
}
