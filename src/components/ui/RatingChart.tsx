"use client";

import { useState } from "react";
import { fetchGoogleMapsSnapshot } from "@/app/[locale]/(dashboard)/dashboard/actions";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

export interface RatingPoint {
  date: string;          // ISO string
  rating: number;
  review_count: number | null;
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function RatingLineChart({ data, reviewsLabel, locale }: { data: RatingPoint[]; reviewsLabel: string; locale: string }) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (data.length === 0) return null;

  const W  = 560;
  const H  = 140;
  const PL = 36;
  const PR = 12;
  const PT = 12;
  const PB = 28;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  const ratings = data.map(d => d.rating);
  const rawMin  = Math.min(...ratings);
  const rawMax  = Math.max(...ratings);
  const pad     = rawMin === rawMax ? 0.3 : 0.1;
  const minR    = Math.max(1, rawMin - pad);
  const maxR    = Math.min(5, rawMax + pad);
  const range   = maxR - minR || 0.5;

  const xOf = (i: number) => PL + (i / Math.max(data.length - 1, 1)) * chartW;
  const yOf = (r: number) => PT + chartH - ((r - minR) / range) * chartH;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(d.rating).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${xOf(data.length - 1).toFixed(1)},${(PT + chartH).toFixed(1)} L${xOf(0).toFixed(1)},${(PT + chartH).toFixed(1)} Z`;

  const gridRatings = [minR, (minR + maxR) / 2, maxR].map(r => Math.round(r * 10) / 10);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short" });

  // Label positions: first, middle, last
  const labelIdxs = Array.from(new Set([0, Math.floor((data.length - 1) / 2), data.length - 1]));

  return (
    <div className="relative">
      {/* Tooltip */}
      {hovered !== null && (
        <div
          className="absolute z-10 bg-gray-900 text-white text-xs rounded-xl px-2.5 py-1.5 pointer-events-none shadow-lg"
          style={{
            left: `calc(${((xOf(hovered) - PL) / chartW) * 100}% + ${PL}px - 60px)`,
            top: 0,
          }}
        >
          <p className="font-semibold">{data[hovered].rating.toFixed(1)}★</p>
          {data[hovered].review_count != null && (
            <p className="text-gray-300">{data[hovered].review_count} {reviewsLabel}</p>
          )}
          <p className="text-gray-400">{fmt(data[hovered].date)}</p>
        </div>
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 140 }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Grid lines + Y labels */}
        {gridRatings.map((r, i) => (
          <g key={i}>
            <line
              x1={PL} y1={yOf(r)} x2={W - PR} y2={yOf(r)}
              stroke="#f3f4f6" strokeWidth="1"
            />
            <text x={PL - 4} y={yOf(r) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
              {r.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Area */}
        <path d={areaPath} fill="url(#ratingGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Hover zones (invisible wide rects per data point) */}
        {data.map((_, i) => {
          const cx  = xOf(i);
          const bw  = chartW / Math.max(data.length - 1, 1);
          return (
            <rect
              key={i}
              x={cx - bw / 2}
              y={PT}
              width={bw}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
            />
          );
        })}

        {/* Dots */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xOf(i)}
            cy={yOf(d.rating)}
            r={hovered === i ? 5 : 3}
            fill="white"
            stroke="#22c55e"
            strokeWidth="2"
            style={{ transition: "r 0.1s" }}
          />
        ))}

        {/* X axis labels */}
        {labelIdxs.map((i) => (
          <text
            key={i}
            x={xOf(i)}
            y={H - 4}
            textAnchor="middle"
            fontSize="10"
            fill="#9ca3af"
          >
            {fmt(data[i].date)}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export function GoogleMapsRatingSection({
  data,
  hasApiKey,
}: {
  data: RatingPoint[];
  hasApiKey: boolean;
}) {
  const t      = useTranslations("dashboard");
  const locale = useLocale();
  const router    = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState<string | null>(null);

  const latest       = data.at(-1);
  const oldest       = data.at(0);
  const diff         = latest && oldest ? +(latest.rating - oldest.rating).toFixed(1) : null;
  const reviewsDiff  = latest?.review_count != null && oldest?.review_count != null
    ? latest.review_count - oldest.review_count : null;

  async function handleSync() {
    setLoading(true);
    setMsg(null);
    const result = await fetchGoogleMapsSnapshot();
    setLoading(false);
    if (result.ok) {
      setMsg(t("ratingUpdated"));
      router.refresh();
    } else {
      setMsg(result.error ?? t("ratingError"));
    }
  }

  if (!hasApiKey) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
        <h2 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          {t("ratingTitle")}
        </h2>
        <p className="text-xs text-gray-400 mt-2">
          {t("ratingNoApiKey")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          {t("ratingTitle")}
        </h2>
        <button
          onClick={handleSync}
          disabled={loading}
          aria-label={loading ? t("ratingSyncing") : t("ratingSync")}
          className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium disabled:opacity-50 transition"
        >
          {loading ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {loading ? t("ratingSyncing") : t("ratingSync")}
        </button>
      </div>

      {msg && (
        <p className={`text-xs mb-3 ${msg.startsWith("¡") ? "text-green-600" : "text-red-500"}`}>
          {msg}
        </p>
      )}

      {data.length === 0 ? (
        <div className="text-center py-8">
          <StarIcon className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-500">{t("ratingNoData")}</p>
          <p className="text-xs text-gray-400 mt-1">{t("ratingNoDataDesc")}</p>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="flex items-baseline gap-4 mb-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold text-gray-900">
                {latest!.rating.toFixed(1)}
              </span>
              <StarIcon className="w-5 h-5 text-yellow-400 mb-0.5" />
            </div>
            <div className="flex flex-col gap-0.5">
              {diff !== null && diff !== 0 && (
                <span className={`text-xs font-semibold ${diff > 0 ? "text-green-600" : "text-red-500"}`}>
                  {diff > 0 ? "▲" : "▼"} {Math.abs(diff).toFixed(1)} {t("ratingDays", { count: data.length })}
                </span>
              )}
              {reviewsDiff !== null && reviewsDiff > 0 && (
                <span className="text-xs text-green-600 font-medium">
                  {t("ratingNewReviews", { count: reviewsDiff })}
                </span>
              )}
              {latest!.review_count != null && (
                <span className="text-xs text-gray-400">
                  {t("ratingTotal", { count: latest!.review_count.toLocaleString(locale) })}
                </span>
              )}
            </div>
          </div>

          {/* Chart */}
          {data.length >= 2 ? (
            <RatingLineChart data={data} reviewsLabel={t("ratingReviews")} locale={locale} />
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">
              {t("ratingMinRecords")}
            </p>
          )}
        </>
      )}
    </div>
  );
}
