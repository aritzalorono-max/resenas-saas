import { createClient } from "@/lib/supabase/server";
import {
  ThumbsUp, ThumbsDown, Lightbulb, BarChart2, Star,
  TrendingUp, MessageSquare, AlertCircle, Quote,
} from "lucide-react";
import type { BusinessReport } from "@/types";
import { GenerateButton } from "./GenerateButton";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function fmtPeriod(start: string, end: string) {
  return `${new Date(start).toLocaleDateString("es-ES", { month: "long", year: "numeric" })} — ${new Date(end).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SentimentBar({ positive, negative, neutral }: { positive: number; negative: number; neutral: number }) {
  const total = positive + negative + neutral;
  if (total === 0) return null;
  const pPct = Math.round((positive / total) * 100);
  const nPct = Math.round((negative / total) * 100);
  const uPct = 100 - pPct - nPct;
  return (
    <div className="h-3 rounded-full overflow-hidden flex gap-0.5 mt-3">
      {pPct > 0 && <div className="bg-green-500 rounded-full" style={{ width: `${pPct}%` }} title={`Positivas ${pPct}%`} />}
      {uPct > 0 && <div className="bg-gray-300 rounded-full" style={{ width: `${uPct}%` }} title={`Neutrales ${uPct}%`} />}
      {nPct > 0 && <div className="bg-red-400 rounded-full" style={{ width: `${nPct}%` }} title={`Negativas ${nPct}%`} />}
    </div>
  );
}

function ThemeCard({ theme, examples, count, variant }: {
  theme: string; examples: string[]; count: number; variant: "positive" | "negative";
}) {
  const isPositive = variant === "positive";
  return (
    <div className={`rounded-2xl p-4 border ${isPositive ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={`font-semibold text-sm leading-snug ${isPositive ? "text-green-800" : "text-red-800"}`}>{theme}</p>
        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
          ×{count}
        </span>
      </div>
      {examples.slice(0, 2).map((ex, i) => (
        <div key={i} className="flex gap-1.5 mt-1.5">
          <Quote className={`w-3 h-3 shrink-0 mt-0.5 ${isPositive ? "text-green-400" : "text-red-400"}`} />
          <p className={`text-xs italic leading-relaxed ${isPositive ? "text-green-700" : "text-red-700"}`}>{ex}</p>
        </div>
      ))}
    </div>
  );
}

function IdeaCard({ title, description, based_on_count, example_comments }: {
  title: string; description: string; based_on_count: number; example_comments: string[];
}) {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 bg-amber-200 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-amber-700" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-amber-900 text-sm leading-snug">{title}</p>
          <p className="text-amber-800 text-xs mt-1 leading-relaxed">{description}</p>
          {example_comments.slice(0, 1).map((ex, i) => (
            <div key={i} className="flex gap-1.5 mt-2">
              <Quote className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" />
              <p className="text-xs italic text-amber-700 leading-relaxed">{ex}</p>
            </div>
          ))}
          <p className="text-xs text-amber-600 mt-2">Basado en {based_on_count} comentario{based_on_count !== 1 ? "s" : ""}</p>
        </div>
      </div>
    </div>
  );
}

function StarsCalculatorCard({ sc }: { sc: BusinessReport["stars_calculator"] }) {
  if (!sc.current_rating || !sc.current_review_count) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
        <p className="text-sm text-gray-400">Sin datos de Google Maps disponibles aún</p>
        <p className="text-xs text-gray-400 mt-1">El rastreador automático captura la puntuación diariamente</p>
      </div>
    );
  }

  const needed      = sc.five_stars_needed_for_next ?? 0;
  const nextTarget  = sc.next_target_rating ?? sc.current_rating;
  const atMax       = sc.current_rating >= 5.0 || needed === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <h3 className="font-semibold text-gray-900 text-sm">Calculadora de estrellas</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{sc.current_rating.toFixed(1)}★</p>
          <p className="text-xs text-gray-400 mt-0.5">Puntuación actual</p>
        </div>
        <div className="bg-brand-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-brand-700">{nextTarget.toFixed(1)}★</p>
          <p className="text-xs text-brand-500 mt-0.5">Objetivo</p>
        </div>
      </div>

      {atMax ? (
        <p className="text-sm text-center text-green-600 font-medium">¡Puntuación perfecta! 🎉</p>
      ) : (
        <>
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 text-center mb-3">
            <p className="text-3xl font-extrabold text-brand-700">{needed}</p>
            <p className="text-xs text-brand-600 mt-0.5">
              reseñas de 5★ necesarias para llegar a {nextTarget.toFixed(1)}★
            </p>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Actualmente {sc.current_review_count.toLocaleString("es-ES")} reseñas con media {sc.current_rating.toFixed(1)}★
          </p>
        </>
      )}
    </div>
  );
}

function FrequencyCard({ fr }: { fr: BusinessReport["frequency_recommendation"] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-brand-600" />
        <h3 className="font-semibold text-gray-900 text-sm">Frecuencia recomendada</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-brand-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-brand-700">{fr.recommended_monthly_target}</p>
          <p className="text-xs text-brand-500 mt-0.5">solicitudes/mes</p>
        </div>
        <div className="bg-brand-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-brand-700">{fr.recommended_weekly_target}</p>
          <p className="text-xs text-brand-500 mt-0.5">solicitudes/semana</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3 bg-gray-50 rounded-xl px-3 py-2">
        <span>Media actual</span>
        <span className="font-semibold text-gray-700">{fr.current_monthly_avg_requests} solicitudes/mes</span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-50 rounded-xl px-3 py-2">
        <span>Tasa de conversión</span>
        <span className="font-semibold text-gray-700">{fr.conversion_rate}%</span>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
        💡 {fr.reasoning}
      </p>
    </div>
  );
}

function ComparisonCard({ pc }: { pc: BusinessReport["platform_comparison"] }) {
  const wsScore = (pc.whatsapp_positive_rate / 100) * 5;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-brand-600" />
        <h3 className="font-semibold text-gray-900 text-sm">WhatsApp vs plataformas públicas</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
            <p className="text-xs text-blue-500 font-medium">WhatsApp privado</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{wsScore.toFixed(1)}/5</p>
          <p className="text-xs text-blue-500 mt-0.5">{pc.whatsapp_positive_rate}% positivos</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <p className="text-xs text-amber-600 font-medium">Google Maps</p>
          </div>
          {pc.platform_rating ? (
            <>
              <p className="text-2xl font-bold text-amber-700">{pc.platform_rating.toFixed(1)}★</p>
              <p className="text-xs text-amber-600 mt-0.5">{pc.platform_review_count?.toLocaleString("es-ES") ?? "—"} reseñas</p>
            </>
          ) : (
            <p className="text-sm text-amber-500 mt-2">Sin datos</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-xl px-3 py-2">
        {pc.gap_description}
      </p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function InformesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  const businessId = business?.id ?? "";

  const { data: reportRow } = await supabase
    .from("business_reports")
    .select("*")
    .eq("business_id", businessId)
    .order("generated_at", { ascending: false })
    .limit(1)
    .single();

  const report = reportRow as BusinessReport | null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Informes</h1>
          <p className="text-gray-400 text-sm mt-1">
            {report
              ? `Último informe: ${fmt(report.generated_at)} · Período: ${fmtPeriod(report.period_start, report.period_end)}`
              : "Genera tu primer informe de análisis de reseñas"}
          </p>
        </div>
        <GenerateButton hasReport={!!report} />
      </div>

      {/* Empty state */}
      {!report ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 flex flex-col items-center text-center shadow-card">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
            <BarChart2 className="w-8 h-8 text-brand-400" />
          </div>
          <p className="font-semibold text-gray-700 text-base">Todavía no hay informes</p>
          <p className="text-sm text-gray-400 mt-2 max-w-sm leading-relaxed">
            Pulsa <strong>Generar informe</strong> para que la IA analice todas tus conversaciones de WhatsApp
            y te muestre temas, puntos de mejora y recomendaciones personalizadas.
          </p>
          <div className="mt-6 flex items-center gap-4 text-xs text-gray-400">
            <span>✓ Análisis de sentimiento</span>
            <span>✓ Temas recurrentes</span>
            <span>✓ Ideas de mejora</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">

          {/* ── 1. Análisis de sentimiento ───────────────────────────────── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-brand-600" />
              <h2 className="font-semibold text-gray-900">Análisis de sentimiento</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center bg-gray-50 rounded-xl p-3">
                <p className="text-2xl font-bold text-gray-900">{report.sentiment_summary.total_analyzed}</p>
                <p className="text-xs text-gray-400 mt-0.5">Analizadas</p>
              </div>
              <div className="text-center bg-green-50 rounded-xl p-3">
                <p className="text-2xl font-bold text-green-600">{report.sentiment_summary.positive_count}</p>
                <p className="text-xs text-green-500 mt-0.5">Positivas</p>
              </div>
              <div className="text-center bg-red-50 rounded-xl p-3">
                <p className="text-2xl font-bold text-red-500">{report.sentiment_summary.negative_count}</p>
                <p className="text-xs text-red-400 mt-0.5">Negativas</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-3">
                <p className="text-2xl font-bold text-gray-600">{report.sentiment_summary.neutral_count}</p>
                <p className="text-xs text-gray-400 mt-0.5">Neutrales</p>
              </div>
            </div>

            {report.sentiment_summary.total_analyzed > 0 && (
              <>
                <SentimentBar
                  positive={report.sentiment_summary.positive_count}
                  negative={report.sentiment_summary.negative_count}
                  neutral={report.sentiment_summary.neutral_count}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Positivas</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />Neutrales</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Negativas</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Score medio: <strong className="text-gray-700">{(report.sentiment_summary.avg_score * 100).toFixed(0)}%</strong>
                  </span>
                </div>
              </>
            )}
          </section>

          {/* ── 2. Temas positivos ───────────────────────────────────────── */}
          {report.positive_themes.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <h2 className="font-semibold text-gray-900 text-sm">Lo que más gusta a tus clientes</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.positive_themes.map((t, i) => (
                  <ThemeCard key={i} variant="positive" theme={t.theme} count={t.count} examples={t.examples} />
                ))}
              </div>
            </section>
          )}

          {/* ── 3. Temas negativos ───────────────────────────────────────── */}
          {report.negative_themes.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ThumbsDown className="w-4 h-4 text-red-500" />
                <h2 className="font-semibold text-gray-900 text-sm">Áreas de mejora detectadas</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.negative_themes.map((t, i) => (
                  <ThemeCard key={i} variant="negative" theme={t.theme} count={t.count} examples={t.examples} />
                ))}
              </div>
            </section>
          )}

          {/* ── 4. Ideas de mejora ───────────────────────────────────────── */}
          {report.improvement_ideas.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h2 className="font-semibold text-gray-900 text-sm">Ideas de mejora concretas</h2>
              </div>
              <div className="space-y-3">
                {report.improvement_ideas.map((idea, i) => (
                  <IdeaCard key={i} {...idea} />
                ))}
              </div>
            </section>
          )}

          {/* ── 5 + 6. Métricas de plataforma, estrellas y frecuencia ────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ComparisonCard pc={report.platform_comparison} />
            <StarsCalculatorCard sc={report.stars_calculator} />
          </div>

          <FrequencyCard fr={report.frequency_recommendation} />

          {/* ── Aviso de datos insuficientes ────────────────────────────── */}
          {report.total_analyzed < 3 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Pocas conversaciones disponibles</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  El análisis de temas con IA requiere al menos 3 respuestas de clientes. Las métricas de sentimiento
                  y estrellas son precisas, pero los temas y las ideas de mejora se activarán a medida que recibas más feedback.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
