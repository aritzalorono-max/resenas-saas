"use client";

import { CheckCircle2, TrendingUp, Info, Link2, Loader2 } from "lucide-react";
import type { Business, ReviewAnalysis, TFunction } from "./types";
import { StarDisplay } from "./helpers";
import { ConnectPrompt } from "./ConnectPrompt";

export function ProfileTab({
  business,
  analysis,
  loadingAnalysis,
  onConnect,
  connected,
  t,
}: {
  business: Business | null;
  analysis: ReviewAnalysis | null;
  loadingAnalysis: boolean;
  onConnect: () => void;
  connected: boolean;
  t: TFunction;
}) {
  if (!connected) {
    return <ConnectPrompt onConnect={onConnect} t={t} />;
  }

  return (
    <div className="space-y-6">
      {/* Business info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{business?.name}</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <CheckCircle2 size={14} className="text-green-500" />
              {t("profileConnected")}
            </p>
          </div>
          {analysis && (
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 justify-end">
                <StarDisplay rating={Math.round(analysis.averageRating)} />
                <span className="text-lg font-bold text-gray-900">
                  {analysis.averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {analysis.reviewCount} {analysis.reviewCount === 1 ? t("reviewSingular") : t("reviewPlural")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis */}
      {loadingAnalysis ? (
        <div role="status" aria-live="polite" className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-3">
          <Loader2 size={20} className="animate-spin text-brand-600" aria-hidden="true" />
          <span className="text-sm text-gray-600">{t("loadingAnalysis")}</span>
        </div>
      ) : analysis ? (
        <>
          {/* Sentiment overview */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-brand-600" />
              <h3 className="font-semibold text-gray-900">{t("reputationTitle")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("sentimentLabel")}
                </p>
                <p className="text-sm font-semibold text-gray-900">{analysis.overallSentiment}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("trendLabel")}
                </p>
                <p className="text-sm font-semibold text-gray-900">{analysis.ratingTrend}</p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-brand-600" />
              <h3 className="font-semibold text-gray-900">{t("suggestionsTitle")}</h3>
            </div>
            <ul className="space-y-3">
              {analysis.profileSuggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{s}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}

      {/* Reconnect button */}
      <div className="flex justify-end">
        <button
          onClick={onConnect}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
        >
          <Link2 size={14} />
          {t("reconnect")}
        </button>
      </div>
    </div>
  );
}
