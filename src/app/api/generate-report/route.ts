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

// Maps locale codes to language names for Claude prompts
const LANGUAGE_NAME: Record<string, string> = {
  es: "Spanish",
  en: "English",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
};

// ── Stars calculator ──────────────────────────────────────────────────────────
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
  const actualTarget = nextTarget - 0.049;
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
  positiveRate:  number,
  locale: string,
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

  const currentPositivePerMonth = Math.round(avgMonthly * conversionRate);
  const targetPositivePerMonth  = Math.max(10, Math.ceil(currentPositivePerMonth * 1.3));
  const recommendedMonthly      = conversionRate > 0
    ? Math.ceil(targetPositivePerMonth / conversionRate)
    : Math.max(avgMonthly * 2, 50);

  const pct = Math.round(conversionRate * 100);
  const reasoning = buildFrequencyReasoning(locale, { conversionRate, pct, recommendedMonthly, targetPositivePerMonth });

  return {
    current_monthly_avg_requests: avgMonthly,
    conversion_rate:              Math.round(conversionRate * 100),
    recommended_monthly_target:   recommendedMonthly,
    recommended_weekly_target:    Math.ceil(recommendedMonthly / 4),
    reasoning,
  };
}

function buildFrequencyReasoning(
  locale: string,
  { conversionRate, pct, recommendedMonthly, targetPositivePerMonth }:
  { conversionRate: number; pct: number; recommendedMonthly: number; targetPositivePerMonth: number },
): string {
  const highConversion: Record<string, string> = {
    es: `Tu tasa de conversión es alta (${pct}%). Con ${recommendedMonthly} solicitudes al mes obtendrías ~${targetPositivePerMonth} reseñas positivas nuevas, suficiente para mantener la frecuencia que Google Maps prioriza en los resultados locales.`,
    en: `Your conversion rate is high (${pct}%). With ${recommendedMonthly} requests per month you would get ~${targetPositivePerMonth} new positive reviews — enough to maintain the frequency Google Maps prioritises in local results.`,
    fr: `Votre taux de conversion est élevé (${pct}%). Avec ${recommendedMonthly} demandes par mois, vous obtiendriez ~${targetPositivePerMonth} nouveaux avis positifs, suffisant pour maintenir la fréquence que Google Maps privilégie dans les résultats locaux.`,
    de: `Ihre Konversionsrate ist hoch (${pct}%). Mit ${recommendedMonthly} Anfragen pro Monat würden Sie ~${targetPositivePerMonth} neue positive Bewertungen erhalten – genug, um die Frequenz aufrechtzuerhalten, die Google Maps in den lokalen Ergebnissen bevorzugt.`,
    it: `Il tuo tasso di conversione è alto (${pct}%). Con ${recommendedMonthly} richieste al mese otterresti ~${targetPositivePerMonth} nuove recensioni positive, sufficiente per mantenere la frequenza che Google Maps privilegia nei risultati locali.`,
    pt: `A sua taxa de conversão é alta (${pct}%). Com ${recommendedMonthly} pedidos por mês obteria ~${targetPositivePerMonth} novas avaliações positivas, suficiente para manter a frequência que o Google Maps prioriza nos resultados locais.`,
  };
  const lowConversion: Record<string, string> = {
    es: `Google Maps favorece los negocios con reseñas recientes y frecuentes. Con ${recommendedMonthly} solicitudes al mes y tu tasa de conversión actual (~${pct}%) obtendrías ~${targetPositivePerMonth} reseñas positivas publicadas cada mes.`,
    en: `Google Maps favours businesses with recent and frequent reviews. With ${recommendedMonthly} requests per month and your current conversion rate (~${pct}%) you would get ~${targetPositivePerMonth} positive reviews published each month.`,
    fr: `Google Maps favorise les établissements avec des avis récents et fréquents. Avec ${recommendedMonthly} demandes par mois et votre taux de conversion actuel (~${pct}%), vous obtiendriez ~${targetPositivePerMonth} avis positifs publiés chaque mois.`,
    de: `Google Maps bevorzugt Unternehmen mit aktuellen und häufigen Bewertungen. Mit ${recommendedMonthly} Anfragen pro Monat und Ihrer aktuellen Konversionsrate (~${pct}%) würden Sie ~${targetPositivePerMonth} positive Bewertungen pro Monat veröffentlichen.`,
    it: `Google Maps favorisce le attività con recensioni recenti e frequenti. Con ${recommendedMonthly} richieste al mese e il tuo attuale tasso di conversione (~${pct}%) otterresti ~${targetPositivePerMonth} recensioni positive pubblicate ogni mese.`,
    pt: `O Google Maps favorece os negócios com avaliações recentes e frequentes. Com ${recommendedMonthly} pedidos por mês e a sua taxa de conversão atual (~${pct}%) obteria ~${targetPositivePerMonth} avaliações positivas publicadas por mês.`,
  };

  const map = conversionRate >= 0.5 ? highConversion : lowConversion;
  return map[locale] ?? map["en"];
}

function buildGapDescription(
  locale: string,
  { gap, whatsappScore, platformRating }:
  { gap: number; whatsappScore: number; platformRating: number },
): string {
  const noData: Record<string, string> = {
    es: "Sin datos de plataforma disponibles aún.",
    en: "No platform data available yet.",
    fr: "Aucune donnée de plateforme disponible pour l'instant.",
    de: "Noch keine Plattformdaten verfügbar.",
    it: "Nessun dato di piattaforma disponibile ancora.",
    pt: "Sem dados de plataforma disponíveis ainda.",
  };
  const highGap: Record<string, string> = {
    es: `Las reseñas publicadas en Google Maps (${platformRating}★) son ${gap.toFixed(1)} puntos más altas que el feedback privado (${whatsappScore.toFixed(1)}/5). Es normal: los clientes muy satisfechos publican y los insatisfechos no lo hacen, lo que infla la media pública.`,
    en: `Published reviews on Google Maps (${platformRating}★) are ${gap.toFixed(1)} points higher than private feedback (${whatsappScore.toFixed(1)}/5). This is normal: very satisfied customers publish while dissatisfied ones don't, which inflates the public average.`,
    fr: `Les avis publiés sur Google Maps (${platformRating}★) sont ${gap.toFixed(1)} points plus élevés que les retours privés (${whatsappScore.toFixed(1)}/5). C'est normal : les clients très satisfaits publient tandis que les insatisfaits ne le font pas, ce qui gonfle la moyenne publique.`,
    de: `Veröffentlichte Bewertungen auf Google Maps (${platformRating}★) sind ${gap.toFixed(1)} Punkte höher als das private Feedback (${whatsappScore.toFixed(1)}/5). Das ist normal: sehr zufriedene Kunden veröffentlichen, unzufriedene nicht, was den öffentlichen Durchschnitt erhöht.`,
    it: `Le recensioni pubblicate su Google Maps (${platformRating}★) sono ${gap.toFixed(1)} punti più alte del feedback privato (${whatsappScore.toFixed(1)}/5). È normale: i clienti molto soddisfatti pubblicano mentre gli insoddisfatti no, il che gonfia la media pubblica.`,
    pt: `As avaliações publicadas no Google Maps (${platformRating}★) são ${gap.toFixed(1)} pontos mais altas que o feedback privado (${whatsappScore.toFixed(1)}/5). É normal: os clientes muito satisfeitos publicam enquanto os insatisfeitos não o fazem, o que infla a média pública.`,
  };
  const lowGap: Record<string, string> = {
    es: `El feedback privado (${whatsappScore.toFixed(1)}/5) supera la media pública de Google Maps (${platformRating}★). Hay clientes satisfechos que no están llegando a publicar su reseña — aumentar los envíos puede cerrar esa brecha.`,
    en: `Private feedback (${whatsappScore.toFixed(1)}/5) exceeds the public Google Maps average (${platformRating}★). There are satisfied customers who are not publishing their review — increasing outreach can close that gap.`,
    fr: `Les retours privés (${whatsappScore.toFixed(1)}/5) dépassent la moyenne publique de Google Maps (${platformRating}★). Des clients satisfaits ne publient pas leur avis — augmenter les envois peut combler cet écart.`,
    de: `Privates Feedback (${whatsappScore.toFixed(1)}/5) übersteigt den öffentlichen Google Maps-Durchschnitt (${platformRating}★). Es gibt zufriedene Kunden, die ihre Bewertung nicht veröffentlichen — mehr Anfragen können diese Lücke schließen.`,
    it: `Il feedback privato (${whatsappScore.toFixed(1)}/5) supera la media pubblica di Google Maps (${platformRating}★). Ci sono clienti soddisfatti che non stanno pubblicando la loro recensione — aumentare i contatti può colmare quel divario.`,
    pt: `O feedback privado (${whatsappScore.toFixed(1)}/5) supera a média pública do Google Maps (${platformRating}★). Há clientes satisfeitos que não estão a publicar a sua avaliação — aumentar os envios pode fechar essa lacuna.`,
  };
  const aligned: Record<string, string> = {
    es: `El feedback privado (${whatsappScore.toFixed(1)}/5) y las reseñas públicas (${platformRating}★) están alineados. Los clientes satisfechos sí están llegando a publicar.`,
    en: `Private feedback (${whatsappScore.toFixed(1)}/5) and public reviews (${platformRating}★) are aligned. Satisfied customers are successfully publishing their reviews.`,
    fr: `Les retours privés (${whatsappScore.toFixed(1)}/5) et les avis publics (${platformRating}★) sont alignés. Les clients satisfaits publient bien leurs avis.`,
    de: `Privates Feedback (${whatsappScore.toFixed(1)}/5) und öffentliche Bewertungen (${platformRating}★) sind ausgerichtet. Zufriedene Kunden veröffentlichen erfolgreich ihre Bewertungen.`,
    it: `Il feedback privato (${whatsappScore.toFixed(1)}/5) e le recensioni pubbliche (${platformRating}★) sono allineati. I clienti soddisfatti stanno pubblicando con successo.`,
    pt: `O feedback privado (${whatsappScore.toFixed(1)}/5) e as avaliações públicas (${platformRating}★) estão alinhados. Os clientes satisfeitos estão a publicar as suas avaliações.`,
  };

  if (!platformRating) return noData[locale] ?? noData["en"];
  if (gap > 0.3)  return highGap[locale] ?? highGap["en"];
  if (gap < -0.3) return lowGap[locale]  ?? lowGap["en"];
  return aligned[locale] ?? aligned["en"];
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
  locale: string,
): Promise<ClaudeAnalysisResult> {
  const anthropic    = new Anthropic();
  const languageName = LANGUAGE_NAME[locale] ?? "English";

  const reviewLines = reviews
    .map((r, i) => `[${i + 1}] (${r.status}): "${r.customer_response}"`)
    .join("\n");

  const response = await anthropic.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 2500,
    messages: [{
      role:    "user",
      content: `Analyse the following customer feedback received via WhatsApp for the business "${businessName}".

CUSTOMER RESPONSES (${reviews.length} total):
${reviewLines}

Respond ONLY with a valid JSON object with this exact structure:
{
  "positive_themes": [
    { "theme": "max 5 words in ${languageName}", "count": number_of_related_responses, "examples": ["verbatim quote 1", "verbatim quote 2"] }
  ],
  "negative_themes": [
    { "theme": "max 5 words in ${languageName}", "count": number_of_related_responses, "examples": ["verbatim quote 1", "verbatim quote 2"] }
  ],
  "improvement_ideas": [
    { "title": "Concrete action in ${languageName}", "description": "2-3 sentences in ${languageName} explaining the improvement", "based_on_count": number, "example_comments": ["verbatim quote"] }
  ]
}

Rules:
- 3-5 positive themes, 2-4 negative themes, 3-4 improvement ideas (if there is enough negative/neutral feedback)
- Quotes must be the customer's exact words (max 2 per theme)
- Theme names and all generated text MUST be in ${languageName}; sort by descending frequency
- Improvement ideas based only on negative or neutral feedback
- Customer quotes stay verbatim in their original language
- Only JSON, no additional text before or after`,
    }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Claude returned non-text content");

  const jsonStr = content.text.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(jsonStr) as ClaudeAnalysisResult;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body   = await req.json().catch(() => ({}));
  const locale = (typeof body?.locale === "string" && LANGUAGE_NAME[body.locale])
    ? body.locale
    : "es";

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("user_id", user.id)
    .single();

  if (!business) return Response.json({ error: "Business not found" }, { status: 404 });

  const periodEnd   = new Date();
  const periodStart = new Date(periodEnd);
  periodStart.setMonth(periodStart.getMonth() - 6);

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
  const gap           = snapshot?.rating ? snapshot.rating - whatsappScore : 0;
  const gapDescription = buildGapDescription(locale, {
    gap,
    whatsappScore,
    platformRating: snapshot?.rating ?? 0,
  });

  const platformComparison: ReportPlatformComparison = {
    whatsapp_positive_rate: positiveRate,
    platform_rating:        snapshot?.rating       ?? null,
    platform_review_count:  snapshot?.review_count ?? null,
    gap_description:        gapDescription,
  };

  const starsCalculator         = computeStarsCalculator(snapshot?.rating ?? null, snapshot?.review_count ?? null);
  const frequencyRecommendation = computeFrequencyRecommendation(allDates, positiveRate, locale);

  // ── AI themes & improvement ideas ───────────────────────────────────────
  let positiveThemes:   ReportTheme[]           = [];
  let negativeThemes:   ReportTheme[]           = [];
  let improvementIdeas: ReportImprovementIdea[] = [];

  if (reviews.length >= 3) {
    try {
      const aiResult = await analyzeWithClaude(
        reviews as Array<{ customer_response: string; status: string }>,
        business.name,
        locale,
      );
      positiveThemes   = aiResult.positive_themes   ?? [];
      negativeThemes   = aiResult.negative_themes   ?? [];
      improvementIdeas = aiResult.improvement_ideas ?? [];
    } catch (err) {
      logger.error("Error in AI report analysis", err);
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
    logger.error("Error saving report", error);
    return Response.json({ error: "Error saving report" }, { status: 500 });
  }

  logger.info(`Report generated for business ${business.id}: ${reviews.length} responses analysed`);
  return Response.json({ success: true, data: report });
}
