"use client";

import { Loader2, TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react";
import type { ReviewAnalysis, TFunction } from "./types";
import { StarDisplay } from "./helpers";

export function AnalysisTab({
  analysis,
  loading,
  t,
}: {
  analysis: ReviewAnalysis | null;
  loading: boolean;
  t: TFunction;
}) {
  if (loading) {
    return (
      <div role="status" aria-live="polite" className="flex items-center justify-center py-16 gap-3">
        <Loader2 size={20} className="animate-spin text-brand-600" aria-hidden="true" />
        <span className="text-sm text-gray-600">{t("loadingAnalysisTab")}</span>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12 text-gray-400">
        <TrendingUp size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">{t("noAnalysis")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-gray-900">
            {analysis.averageRating.toFixed(1)}
          </p>
          <StarDisplay rating={Math.round(analysis.averageRating)} />
          <p className="text-xs text-gray-500 mt-1">{t("avgRating")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-gray-900">{analysis.reviewCount}</p>
          <p className="text-sm text-gray-600 mt-1">{t("totalReviews")}</p>
          <p className="text-xs text-gray-500 mt-0.5">{t("analyzed")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
          <p className="text-lg font-bold text-gray-900 mt-1">{analysis.overallSentiment}</p>
          <p className="text-xs text-gray-500 mt-1">{t("overallSentiment")}</p>
        </div>
      </div>

      {/* Trend */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="text-brand-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t("trend")}</h3>
        </div>
        <p className="text-sm text-gray-700">{analysis.ratingTrend}</p>
      </div>

      {/* Praises */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ThumbsUp size={16} className="text-green-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t("praisesTitle")}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.topPraises.map((p, i) => (
            <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Complaints */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ThumbsDown size={16} className="text-red-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t("complaintsTitle")}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.topComplaints.map((c, i) => (
            <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
