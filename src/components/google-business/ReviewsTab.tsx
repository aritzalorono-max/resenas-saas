"use client";

import { useState } from "react";
import { Star, Loader2, AlertTriangle } from "lucide-react";
import type { GoogleReview, TFunction } from "./types";
import { ReviewCard } from "./ReviewCard";

export function ReviewsTab({
  reviews,
  loading,
  error,
  businessName,
  tone,
  onReplyPublished,
  onFlagged,
  t,
}: {
  reviews: GoogleReview[];
  loading: boolean;
  error: string;
  businessName: string;
  tone: string;
  onReplyPublished: (name: string) => void;
  onFlagged: (name: string) => void;
  t: TFunction;
}) {
  const [starFilter, setStarFilter] = useState<"all" | "1-2" | "3" | "4-5">("all");

  const filtered = reviews.filter((r) => {
    if (starFilter === "1-2") return r.starRatingNum <= 2;
    if (starFilter === "3") return r.starRatingNum === 3;
    if (starFilter === "4-5") return r.starRatingNum >= 4;
    return true;
  });

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="flex items-center justify-center py-16 gap-3">
        <Loader2 size={20} className="animate-spin text-brand-600" aria-hidden="true" />
        <span className="text-sm text-gray-600">{t("loadingReviews")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-700 text-sm">
        <AlertTriangle size={18} />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-gray-500 mr-1">{t("filterLabel")}</span>
        {(["all", "1-2", "3", "4-5"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStarFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
              ${starFilter === f
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {f === "all" ? t("filterAll") : f === "1-2" ? "1-2 ★" : f === "3" ? "3 ★" : "4-5 ★"}
          </button>
        ))}
        <span className="text-xs text-gray-500 ml-2">
          {filtered.length} {filtered.length === 1 ? t("reviewSingular") : t("reviewPlural")}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Star size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">{t("noReviewsFilter")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <ReviewCard
              key={review.name}
              review={review}
              businessName={businessName}
              tone={tone}
              onReplyPublished={onReplyPublished}
              onFlagged={onFlagged}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}
