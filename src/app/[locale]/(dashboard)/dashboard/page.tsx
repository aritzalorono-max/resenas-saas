import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import type { ReviewRequest, BusinessStats } from "@/types";
import { RingChart } from "@/components/ui/RingChart";
import { GoogleMapsRatingSection, type RatingPoint } from "@/components/ui/RatingChart";
import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";

const STATUS_COLORS: Record<string, string> = {
  pending:             "bg-amber-100 text-amber-700",
  positive:            "bg-green-100 text-green-700",
  negative:            "bg-red-100 text-red-600",
  neutral:             "bg-gray-100 text-gray-600",
  no_response:         "bg-gray-100 text-gray-500",
  awaiting_screenshot: "bg-purple-100 text-purple-700",
  rewarded:            "bg-brand-100 text-brand-700",
};

// ─────────────────────────────────────────────────────────────────────────────
// Streaming Server Components (se ejecutan en paralelo tras el batch inicial)
// ─────────────────────────────────────────────────────────────────────────────

async function ChartSection({ businessId, placeId, hasApiKey }: { businessId: string; placeId: string | null; hasApiKey: boolean }) {
  if (!businessId) return <GoogleMapsRatingSection data={[]} hasApiKey={hasApiKey} />;

  const supabase = await createClient();
  let query = supabase
    .from("google_maps_snapshots")
    .select("rating, review_count, fetched_at")
    .eq("business_id", businessId)
    .order("fetched_at", { ascending: true })
    .limit(60);

  // Only show snapshots for the current place to avoid mixing data from different businesses
  if (placeId) query = query.eq("place_id", placeId);

  const { data: snapshots } = await query;

  const chartData: RatingPoint[] = (snapshots ?? [])
    .filter(s => s.rating != null)
    .map(s => ({ date: s.fetched_at, rating: s.rating!, review_count: s.review_count }));

  return <GoogleMapsRatingSection data={chartData} hasApiKey={hasApiKey} />;
}

type RecentListProps = {
  recent: ReviewRequest[] | null;
  statusLabels: Record<string, { label: string; color: string }>;
  recentTitle: string;
  viewAll: string;
  noRecent: string;
  noRecentDesc: string;
  noDataLink: string;
};

async function RecentSection({ businessId, statusLabels, recentTitle, viewAll, noRecent, noRecentDesc, noDataLink }: { businessId: string; statusLabels: Record<string, { label: string; color: string }>; recentTitle: string; viewAll: string; noRecent: string; noRecentDesc: string; noDataLink: string }) {
  if (!businessId) return <RecentList recent={null} statusLabels={statusLabels} recentTitle={recentTitle} viewAll={viewAll} noRecent={noRecent} noRecentDesc={noRecentDesc} noDataLink={noDataLink} />;

  const supabase = await createClient();
  const { data: recent } = await supabase
    .from("review_requests")
    .select("id, customer_name, customer_phone, status, customer_response, created_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(10);

  return <RecentList recent={(recent ?? null) as ReviewRequest[] | null} statusLabels={statusLabels} recentTitle={recentTitle} viewAll={viewAll} noRecent={noRecent} noRecentDesc={noRecentDesc} noDataLink={noDataLink} />;
}

function RecentList({ recent, statusLabels, recentTitle, viewAll, noRecent, noRecentDesc, noDataLink }: RecentListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
      <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-sm">{recentTitle}</h2>
        <Link href="/resenas" className="text-xs text-brand-600 font-semibold hover:text-brand-700">
          {viewAll}
        </Link>
      </div>

      {!recent?.length ? (
        <div className="px-6 py-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <p className="font-semibold text-gray-700 text-sm">{noRecent}</p>
          <p className="text-xs text-gray-400 mt-1 mb-4 max-w-xs">
            {noRecentDesc}
          </p>
          <Link
            href="/clientes"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            {noDataLink} →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {recent.map((req) => {
            const s = statusLabels[req.status] ?? statusLabels.pending;
            return (
              <div key={req.id} className="px-4 py-3.5 flex items-start justify-between gap-3 hover:bg-gray-50/50 transition">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm truncate">{req.customer_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{req.customer_phone}</p>
                  {req.customer_response && (
                    <p className="text-xs text-gray-500 mt-1.5 italic line-clamp-1 bg-gray-50 px-2 py-1 rounded-lg">
                      &ldquo;{req.customer_response}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${s.color}`}>
                    {s.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(req.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Batch 1: business + stats (mismo user_id filter → paralelo, ~200ms)
  // El HTML empieza a streamearse en cuanto este batch termina.
  // ChartSection y RecentSection arrancan sus queries en paralelo tras este batch.
  const [{ data: business }, statsResult] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, name, google_maps_url, google_place_id")
      .eq("user_id", user!.id)
      .single(),
    supabase
      .from("business_stats")
      .select("*")
      .eq("user_id", user!.id)
      .single(),
  ]);

  const stats      = (statsResult.data ?? null) as BusinessStats | null;
  const businessId = business?.id ?? "";
  const placeId    = business?.google_place_id ?? null;
  const hasApiKey  = !!process.env.GOOGLE_PLACES_API_KEY;

  const total     = stats?.total_requests ?? 0;
  const positives = stats?.positive_count ?? 0;
  const negatives = stats?.negative_count ?? 0;
  const neutrals  = stats?.neutral_count  ?? 0;
  const pending   = stats?.pending_count  ?? 0;
  const rate      = Number(stats?.positive_rate ?? 0);
  const responded = positives + negatives + neutrals;

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending:             { label: t("pending"),    color: STATUS_COLORS.pending             },
    positive:            { label: t("positive"),   color: STATUS_COLORS.positive            },
    negative:            { label: t("negative"),   color: STATUS_COLORS.negative            },
    neutral:             { label: t("neutral"),    color: STATUS_COLORS.neutral             },
    no_response:         { label: t("noResponse"), color: STATUS_COLORS.no_response         },
    awaiting_screenshot: { label: t("awaitingScreenshot"), color: STATUS_COLORS.awaiting_screenshot },
    rewarded:            { label: t("rewarded"),           color: STATUS_COLORS.rewarded            },
  };

  const bars = [
    { label: t("positive"), count: positives, color: "bg-green-500", bg: "bg-green-100" },
    { label: t("negative"), count: negatives, color: "bg-red-400",   bg: "bg-red-100"   },
    { label: t("neutral"),  count: neutrals,  color: "bg-gray-400",  bg: "bg-gray-100"  },
    { label: t("pending"),  count: pending,   color: "bg-amber-400", bg: "bg-amber-100" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Título — renderizado inmediatamente tras batch 1 */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
          {t("welcome")},<br className="sm:hidden" /> {business?.name ?? ""}
        </h1>
        <p className="text-gray-400 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Onboarding — primeros pasos (solo cuando no hay solicitudes enviadas aún) */}
      {total === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-card animate-slide-up">
          <p className="text-sm font-bold text-gray-900 mb-4">{t("onboardingTitle")}</p>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5
                ${business?.google_maps_url ? "bg-green-500 text-white" : "bg-brand-600 text-white"}`}>
                {business?.google_maps_url ? "✓" : "1"}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${business?.google_maps_url ? "text-gray-400 line-through" : "text-gray-900"}`}>
                  {t("step1Title")}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {business?.google_maps_url ? t("step1Done") : t("step1Desc")}
                </p>
                {!business?.google_maps_url && (
                  <Link href="/configuracion" className="inline-block mt-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700">
                    {t("goToSettings")}
                  </Link>
                )}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{t("step2Title")}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t("step2Desc")}</p>
                <Link href="/clientes" className="inline-block mt-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700">
                  {t("sendRequest")}
                </Link>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-500">{t("step3Title")}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t("step3Desc")}</p>
              </div>
            </li>
          </ol>
        </div>
      )}

      {/* Alerta Google Maps (solo si ya hay solicitudes pero falta la URL) */}
      {total > 0 && !business?.google_maps_url && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3 animate-slide-up">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.75} aria-hidden="true" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">{t("alertNoLink")}</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {t("alertNoLinkDesc")}{" "}
              <Link href="/configuracion" className="underline font-semibold">{t("alertNoLinkCta")}</Link>
            </p>
          </div>
        </div>
      )}

      {/* Métricas principales — inmediatas (batch 1) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 shadow-card">
          <RingChart rate={rate} />
          <p className="text-xs text-gray-400 mt-1">{t("positiveRate")}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-card">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{t("totalRequests")}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none">{total}</p>
        </div>
        <div className="bg-white border border-green-100 rounded-2xl p-4 shadow-card">
          <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">{t("positiveReviews")}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none">{positives}</p>
          <div className="mt-2 h-1.5 rounded-full bg-green-100 overflow-hidden">
            <div className="h-full rounded-full bg-green-500 transition-all duration-700"
              style={{ width: total ? `${(positives / total) * 100}%` : "0%" }} />
          </div>
        </div>
        <div className="bg-white border border-red-50 rounded-2xl p-4 shadow-card">
          <p className="text-xs font-medium text-red-500 uppercase tracking-wide mb-2">{t("negative")}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none">{negatives}</p>
          <div className="mt-2 h-1.5 rounded-full bg-red-100 overflow-hidden">
            <div className="h-full rounded-full bg-red-400 transition-all duration-700"
              style={{ width: total ? `${(negatives / total) * 100}%` : "0%" }} />
          </div>
        </div>
      </div>

      {/* Distribución de respuestas — inmediata (batch 1) */}
      {responded > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-card animate-slide-up animation-delay-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            {t("sentimentTitle")}
          </h2>
          <div className="space-y-3">
            {bars.filter(b => b.count > 0).map((bar) => {
              const pct = total > 0 ? Math.round((bar.count / total) * 100) : 0;
              return (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16 shrink-0">{bar.label}</span>
                  <div className={`flex-1 h-2 rounded-full ${bar.bg} overflow-hidden`}>
                    <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gráfica Google Maps — streaming (no bloquea el render inicial) */}
      <div className="mb-6">
        <Suspense fallback={
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-100 rounded w-24" />
            </div>
            <div className="h-36 bg-gray-100 rounded-xl" />
          </div>
        }>
          <ChartSection businessId={businessId} placeId={placeId} hasApiKey={hasApiKey} />
        </Suspense>
      </div>

      {/* CTA — estático, render inmediato */}
      <Link
        href="/clientes"
        className="block rounded-2xl p-5 mb-6 transition-all duration-200
                   bg-gradient-to-r from-brand-600 to-brand-500
                   hover:from-brand-700 hover:to-brand-600
                   active:scale-[0.99] shadow-md shadow-brand-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-base lg:text-lg leading-snug">
              {t("ctaTitle")}
            </p>
            <p className="text-brand-100 text-sm mt-0.5">
              {t("ctaDesc")}
            </p>
          </div>
          <div className="bg-white/20 rounded-xl p-2.5 ml-3 shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Últimas solicitudes — streaming (no bloquea el render inicial) */}
      <Suspense fallback={
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden animate-pulse">
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-36" />
            <div className="h-4 bg-gray-100 rounded w-16" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-4 py-3.5 border-b border-gray-50 flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-50 rounded w-24" />
              </div>
              <div className="h-5 bg-gray-100 rounded-full w-20" />
            </div>
          ))}
        </div>
      }>
        <RecentSection
          businessId={businessId}
          statusLabels={statusLabels}
          recentTitle={t("recentTitle")}
          viewAll={t("viewAll")}
          noRecent={t("noRecent")}
          noRecentDesc={t("noRecentDesc")}
          noDataLink={t("noDataLink")}
        />
      </Suspense>
    </div>
  );
}
