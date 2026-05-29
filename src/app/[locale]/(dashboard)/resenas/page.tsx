import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import type { ReviewRequest } from "@/types";
import { Check, ChevronLeft, ChevronRight, MessageSquare, Gift } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

const STATUS_STYLE: Record<string, { badge: string; dot: string }> = {
  pending:             { badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-400"   },
  positive:            { badge: "bg-green-100 text-green-700",   dot: "bg-green-500"   },
  negative:            { badge: "bg-red-100 text-red-600",       dot: "bg-red-400"     },
  neutral:             { badge: "bg-gray-100 text-gray-600",     dot: "bg-gray-400"    },
  no_response:         { badge: "bg-gray-100 text-gray-500",     dot: "bg-gray-300"    },
  awaiting_screenshot: { badge: "bg-purple-100 text-purple-700", dot: "bg-purple-400"  },
  rewarded:            { badge: "bg-brand-100 text-brand-700",   dot: "bg-brand-500"   },
};

const PAGE_SIZE = 20;

export default async function ResenasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; month?: string; incentive?: string }>;
}) {
  const [t, locale] = await Promise.all([getTranslations("resenas"), getLocale()]);

  const STATUS_TABS = [
    { value: "all",                label: t("filterAll")                   },
    { value: "positive",           label: t("filterPositive")              },
    { value: "negative",           label: t("filterNegative")              },
    { value: "neutral",            label: t("filterNeutral")               },
    { value: "pending",            label: t("filterPending")               },
    { value: "no_response",        label: t("filterNoResponse")            },
    { value: "awaiting_screenshot",label: t("filterAwaitingScreenshot")    },
    { value: "rewarded",           label: t("filterRewarded")              },
  ];

  const STATUS_LABEL: Record<string, string> = {
    pending:             t("statusPending"),
    positive:            t("statusPositive"),
    negative:            t("statusNegative"),
    neutral:             t("statusNeutral"),
    no_response:         t("statusNoResponse"),
    awaiting_screenshot: t("statusAwaitingScreenshot"),
    rewarded:            t("statusRewarded"),
  };

  const sp              = await searchParams;
  const filterStatus    = sp.status    ?? "all";
  const incentiveFilter = sp.incentive ?? "all";
  const page            = Math.max(1, parseInt(sp.page ?? "1", 10));

  // ── Month ────────────────────────────────────────────────────────────────
  const now             = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const selectedMonth   = sp.month ?? currentMonthStr;
  const [yearStr, monthStr] = selectedMonth.split("-");
  const year                = parseInt(yearStr,  10);
  const month               = parseInt(monthStr, 10);

  const monthStart = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const monthEnd   = new Date(Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1)).toISOString();

  const prevD        = new Date(Date.UTC(year, month - 2, 1));
  const nextD        = new Date(Date.UTC(year, month,     1));
  const prevMStr     = `${prevD.getUTCFullYear()}-${String(prevD.getUTCMonth() + 1).padStart(2, "0")}`;
  const nextMStr     = `${nextD.getUTCFullYear()}-${String(nextD.getUTCMonth() + 1).padStart(2, "0")}`;
  const isCurrentMonth = selectedMonth === currentMonthStr;

  function monthLabel(y: number, m: number): string {
    return new Date(y, m - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });
  }

  // ── Supabase ─────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: business } = await supabase
    .from("businesses").select("id").eq("user_id", user!.id).single();
  const businessId = business?.id ?? "";

  const offset = (page - 1) * PAGE_SIZE;

  // Build the paginated query conditionally before running it.
  // Filters are applied in SQL so only 20 rows are transferred regardless of month size.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pageQuery: any = supabase
    .from("review_requests")
    .select("*", { count: "exact" })
    .eq("business_id", businessId)
    .gte("created_at", monthStart)
    .lt("created_at",  monthEnd)
    .order("created_at", { ascending: false });

  if (filterStatus !== "all")    pageQuery = pageQuery.eq("status", filterStatus);
  if (incentiveFilter === "yes") pageQuery = pageQuery.not("discount_code", "is", null);
  if (incentiveFilter === "no")  pageQuery = pageQuery.is("discount_code", null);

  pageQuery = pageQuery.range(offset, offset + PAGE_SIZE - 1);

  // Ejecuta 6 COUNT queries + la pageQuery en paralelo.
  // Los COUNT usan head:true → 0 bytes de datos transferidos, solo el header count.
  // Esto reemplaza el antiguo statsQuery que descargaba TODAS las filas del mes.
  // Con índices parciales (migration_022), cada COUNT es O(log N).
  const [
    { count: cTotal    },
    { count: cPositive },
    { count: cNegative },
    { count: cNeutral  },
    { count: cRewarded },
    { count: cPending  },
    pageResult,
  ] = await Promise.all([
    supabase.from("review_requests").select("*", { count: "exact", head: true })
      .eq("business_id", businessId).gte("created_at", monthStart).lt("created_at", monthEnd),
    supabase.from("review_requests").select("*", { count: "exact", head: true })
      .eq("business_id", businessId).gte("created_at", monthStart).lt("created_at", monthEnd)
      .in("status", ["positive", "awaiting_screenshot", "rewarded"]),
    supabase.from("review_requests").select("*", { count: "exact", head: true })
      .eq("business_id", businessId).gte("created_at", monthStart).lt("created_at", monthEnd)
      .eq("status", "negative"),
    supabase.from("review_requests").select("*", { count: "exact", head: true })
      .eq("business_id", businessId).gte("created_at", monthStart).lt("created_at", monthEnd)
      .eq("status", "neutral"),
    supabase.from("review_requests").select("*", { count: "exact", head: true })
      .eq("business_id", businessId).gte("created_at", monthStart).lt("created_at", monthEnd)
      .eq("status", "rewarded"),
    supabase.from("review_requests").select("*", { count: "exact", head: true })
      .eq("business_id", businessId).gte("created_at", monthStart).lt("created_at", monthEnd)
      .eq("status", "pending"),
    pageQuery,
  ]);

  // ── Monthly summary stats (de COUNT queries sin transferencia de datos) ────
  const ms = {
    total:    cTotal    ?? 0,
    positive: cPositive ?? 0,
    negative: cNegative ?? 0,
    neutral:  cNeutral  ?? 0,
    rewarded: cRewarded ?? 0,
    pending:  cPending  ?? 0,
  };
  const responded    = ms.positive + ms.negative + ms.neutral;
  const positiveRate = responded > 0 ? Math.round((ms.positive / responded) * 100) : 0;

  // ── Paginated rows from SQL ───────────────────────────────────────────────
  const requests   = (pageResult.data ?? []) as ReviewRequest[];
  const total      = (pageResult.count ?? 0) as number;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // ── URL builder ───────────────────────────────────────────────────────────
  function href(opts: { page?: number; status?: string; month?: string; incentive?: string }): string {
    const p  = new URLSearchParams();
    const s  = opts.status    ?? filterStatus;
    const m  = opts.month     ?? selectedMonth;
    const i  = opts.incentive ?? incentiveFilter;
    const pg = opts.page      ?? 1;
    if (s  !== "all")           p.set("status",    s);
    if (m  !== currentMonthStr) p.set("month",     m);
    if (i  !== "all")           p.set("incentive", i);
    if (pg > 1)                 p.set("page",      String(pg));
    const qs = p.toString();
    return `/resenas${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-5">{t("title")}</h1>

      {/* ── Navegación de mes ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-card">
        <Link
          href={href({ month: prevMStr, page: 1 })}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition px-2 py-1 rounded-lg hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline capitalize text-xs">
            {monthLabel(prevD.getUTCFullYear(), prevD.getUTCMonth() + 1)}
          </span>
        </Link>

        <span className="text-sm font-semibold text-gray-900 capitalize">
          {monthLabel(year, month)}
        </span>

        <Link
          href={isCurrentMonth ? "#" : href({ month: nextMStr, page: 1 })}
          aria-disabled={isCurrentMonth}
          className={`flex items-center gap-1.5 text-sm transition px-2 py-1 rounded-lg ${
            isCurrentMonth
              ? "text-gray-300 pointer-events-none"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <span className="hidden sm:inline capitalize text-xs">
            {monthLabel(nextD.getUTCFullYear(), nextD.getUTCMonth() + 1)}
          </span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── Resumen del mes ───────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5 shadow-card">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {t("monthSummary")}
        </p>
        {ms.total === 0 ? (
          <p className="text-sm text-gray-400 italic">{t("noResults")}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">{ms.total}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t("requests")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{ms.positive}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t("filterPositive")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{ms.negative}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t("filterNegative")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-600">{ms.rewarded}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t("rewarded")}</p>
              </div>
            </div>
            {responded > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">{t("positiveRate")}</span>
                  <span className="text-xs font-semibold text-green-600">{positiveRate}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${positiveRate}%` }}
                  />
                </div>
                <div className="mt-2.5 flex gap-3 flex-wrap text-xs">
                  {ms.positive > 0 && <span className="text-green-600">{t("statsPositive", { count: ms.positive, s: ms.positive !== 1 ? "s" : "" })}</span>}
                  {ms.neutral  > 0 && <span className="text-gray-500">{t("statsNeutral",  { count: ms.neutral,  es: ms.neutral  !== 1 ? "es" : "" })}</span>}
                  {ms.negative > 0 && <span className="text-red-500">{t("statsNegative", { count: ms.negative, s: ms.negative !== 1 ? "s" : "" })}</span>}
                  {ms.pending  > 0 && <span className="text-amber-500">{t("statsPending", { count: ms.pending,  s: ms.pending  !== 1 ? "s" : "" })}</span>}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Filtros ───────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={href({ status: tab.value, page: 1 })}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
              filterStatus === tab.value
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-xs text-gray-400">{t("incentiveLabel")}</span>
        {[
          { value: "all", label: t("incentiveAll") },
          { value: "yes", label: t("incentiveYes") },
          { value: "no",  label: t("incentiveNo")  },
        ].map((opt) => (
          <Link
            key={opt.value}
            href={href({ incentive: opt.value, page: 1 })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              incentiveFilter === opt.value
                ? "bg-brand-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {/* ── Lista ─────────────────────────────────────────────────────────── */}
      <p className="text-xs text-gray-400 mb-4">
        {t("requestsCount", { count: total, s: total !== 1 ? "s" : "", es: total !== 1 ? "es" : "", n: total !== 1 ? "n" : "", e: total !== 1 ? "e" : "" })}
        {filterStatus !== "all" ? ` · ${STATUS_TABS.find(tab => tab.value === filterStatus)?.label ?? ""}` : ""}
      </p>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 px-6 py-16 flex flex-col items-center text-center">
          <p className="font-semibold text-gray-700">{t("noResults")}</p>
          <p className="text-xs text-gray-400 mt-1">{t("noResultsHint")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {requests.map((req) => {
              const style = STATUS_STYLE[req.status] ?? STATUS_STYLE.pending;
              const label = STATUS_LABEL[req.status] ?? t("statusPending");
              const sentDate = new Date(req.created_at).toLocaleDateString(locale, {
                day: "numeric", month: "short",
              });

              return (
                <div key={req.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-card">
                  {/* Nombre + badge */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate leading-snug">
                        {req.customer_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {req.customer_phone}
                        <span className="mx-1.5 text-gray-200">·</span>
                        {sentDate}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${style.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {label}
                      </span>
                      {req.discount_code && (
                        <span className="text-xs text-brand-600 flex items-center gap-1">
                          <Gift className="w-3 h-3" />
                          {req.discount_code}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Respuesta */}
                  {req.customer_response ? (
                    <p className="text-gray-600 text-sm bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 italic line-clamp-2 mt-2">
                      &ldquo;{req.customer_response}&rdquo;
                    </p>
                  ) : (
                    <p className="text-gray-300 text-xs italic mt-2">{t("noResponseYet")}</p>
                  )}

                  {/* Pie */}
                  <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      {req.responded_at && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" strokeWidth={2.5} />
                          {t("responded")}
                        </span>
                      )}
                      {req.sentiment_score != null && (
                        <span className="text-xs text-gray-400 tabular-nums">
                          Score {(req.sentiment_score * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/resenas/${req.id}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {t("viewConversation")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
              <p className="text-sm text-gray-500 order-2 sm:order-1">
                {t("pageInfo", { page, total: totalPages, count: total })}
              </p>
              <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
                <Link
                  href={page > 1 ? href({ page: page - 1 }) : "#"}
                  aria-disabled={page <= 1}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium transition ${
                    page > 1 ? "text-gray-700 hover:border-brand-300 hover:text-brand-700" : "text-gray-300 pointer-events-none"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t("prev")}
                </Link>
                <Link
                  href={page < totalPages ? href({ page: page + 1 }) : "#"}
                  aria-disabled={page >= totalPages}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium transition ${
                    page < totalPages ? "text-gray-700 hover:border-brand-300 hover:text-brand-700" : "text-gray-300 pointer-events-none"
                  }`}
                >
                  {t("next")}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
