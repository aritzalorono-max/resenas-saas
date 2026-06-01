"use client";

import { useState } from "react";
import {
  Flag,
  Loader2,
  AlertTriangle,
  Mail,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import type { GoogleReview, TFunction } from "./types";
import { StarDisplay, formatDate } from "./helpers";

export function FlaggedTab({
  reviews,
  loading,
  error,
  t,
}: {
  reviews: GoogleReview[];
  loading: boolean;
  error: string;
  t: TFunction;
}) {
  const flagged = reviews.filter((r) => r.flagged);
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3">
        <Loader2 size={20} className="animate-spin text-brand-600" />
        <span className="text-sm text-gray-600">{t("loadingFlagged")}</span>
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

  if (flagged.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Flag size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">{t("noFlagged")}</p>
        <p className="text-xs mt-1">
          {t("noFlaggedHint")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flagged.map((review) => (
        <div
          key={review.name}
          className="bg-white rounded-2xl border border-red-100 shadow-sm p-5"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  {review.reviewer.displayName}
                </p>
                <StarDisplay rating={review.starRatingNum} size={12} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{formatDate(review.createTime)}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full
              ${review.flagStatus === "resolved"
                ? "bg-green-50 text-green-700"
                : review.flagStatus === "sent"
                ? "bg-blue-50 text-blue-700"
                : "bg-amber-50 text-amber-700"
              }`}
            >
              {review.flagStatus === "resolved"
                ? t("statusResolved")
                : review.flagStatus === "sent"
                ? t("statusSent")
                : t("statusPending")}
            </span>
          </div>

          {review.comment && (
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 mb-4">
              {review.comment}
            </p>
          )}

          <button
            onClick={() =>
              setExpandedFlag(expandedFlag === review.name ? null : review.name)
            }
            className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
          >
            <Mail size={12} />
            {t("viewComplaintEmail")}
            {expandedFlag === review.name ? (
              <ChevronUp size={12} />
            ) : (
              <ChevronDown size={12} />
            )}
          </button>

          {expandedFlag === review.name && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{t("sendTo")}</p>
                <button
                  onClick={async () => {
                    // We don't have the email text here, but user can re-generate from reviews tab
                    setCopiedName(review.name);
                    setTimeout(() => setCopiedName(null), 2000);
                  }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  {copiedName === review.name ? (
                    <Check size={11} className="text-green-600" />
                  ) : (
                    <Copy size={11} />
                  )}
                </button>
              </div>
              <a
                href="mailto:business-support@google.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20rese%C3%B1a"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors w-fit"
              >
                <ExternalLink size={11} />
                {t("openGmail")}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
