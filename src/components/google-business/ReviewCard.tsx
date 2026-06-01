"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  Flag,
  MessageSquare,
  AlertTriangle,
  Mail,
  Clock,
  User,
} from "lucide-react";
import type { GoogleReview, TFunction } from "./types";
import { StarDisplay, CopyButton, formatDate } from "./helpers";

export function ReviewCard({
  review,
  businessName,
  tone,
  onReplyPublished,
  onFlagged,
  showFlagButton = true,
  t,
}: {
  review: GoogleReview;
  businessName: string;
  tone: string;
  onReplyPublished: (reviewName: string) => void;
  onFlagged: (reviewName: string) => void;
  showFlagButton?: boolean;
  t: TFunction;
}) {
  const [expanded, setExpanded] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [editedReply, setEditedReply] = useState("");
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [flagResult, setFlagResult] = useState<string | null>(null);

  async function handleSuggest() {
    setLoadingSuggest(true);
    setSuggestion("");
    setEditedReply("");
    try {
      const res = await fetch("/api/google-business/suggest-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerName: review.reviewer.displayName,
          reviewText: review.comment ?? "",
          rating: review.starRatingNum,
          businessName,
          tone,
        }),
      });
      if (!res.ok) throw new Error("suggest failed");
      const data = await res.json();
      setSuggestion(data.suggestion ?? "");
      setEditedReply(data.suggestion ?? "");
      setExpanded(true);
    } catch {
      setPublishError(t("errorSuggest"));
    } finally {
      setLoadingSuggest(false);
    }
  }

  async function handlePublish() {
    if (!editedReply.trim()) return;
    setLoadingPublish(true);
    setPublishError("");
    try {
      const res = await fetch("/api/google-business/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewName: review.name,
          replyText: editedReply.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setPublishError(data.error ?? t("errorPublish"));
      } else {
        onReplyPublished(review.name);
        setExpanded(false);
        setSuggestion("");
      }
    } catch {
      setPublishError(t("errorNetwork"));
    } finally {
      setLoadingPublish(false);
    }
  }

  async function handleFlag() {
    if (!flagReason.trim()) return;
    setLoadingFlag(true);
    try {
      const res = await fetch("/api/google-business/flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewName: review.name,
          reviewerName: review.reviewer.displayName,
          reviewText: review.comment ?? "",
          rating: review.starRatingNum,
          flagReason: flagReason.trim(),
        }),
      });
      if (!res.ok) throw new Error("flag failed");
      const data = await res.json();
      setFlagResult(data.complaintText ?? "");
      onFlagged(review.name);
    } catch {
      setFlagResult(t("errorComplaint"));
    } finally {
      setLoadingFlag(false);
    }
  }

  const shortComment =
    review.comment && review.comment.length > 180
      ? review.comment.slice(0, 180) + "…"
      : review.comment;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <User size={18} className="text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {review.reviewer.displayName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarDisplay rating={review.starRatingNum} size={13} />
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={11} />
                {formatDate(review.createTime)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {review.replied && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 size={12} />
              {t("replied")}
            </span>
          )}
          {review.flagged && (
            <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
              <Flag size={12} />
              {t("flagged")}
            </span>
          )}
        </div>
      </div>

      {/* Review text */}
      {review.comment && (
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {expanded ? review.comment : shortComment}
          {review.comment.length > 180 && (
            <button
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              className="ml-1 text-brand-600 hover:text-brand-700 text-xs font-medium"
            >
              {expanded ? t("seeLess") : t("seeMore")}
            </button>
          )}
        </p>
      )}

      {/* Existing reply */}
      {review.reviewReply && (
        <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-1">{t("yourReply")}</p>
          <p className="text-sm text-gray-700">{review.reviewReply.comment}</p>
        </div>
      )}

      {/* Actions */}
      {!review.replied && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSuggest}
            disabled={loadingSuggest}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-60"
          >
            {loadingSuggest ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <MessageSquare size={12} />
            )}
            {t("suggestReply")}
          </button>
          {showFlagButton && !review.flagged && (
            <button
              onClick={() => setShowFlagModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Flag size={12} />
              {t("markProblematic")}
            </button>
          )}
        </div>
      )}

      {/* Suggestion editor */}
      {suggestion && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-medium text-gray-500">{t("suggestedReply")}</p>
          <textarea
            value={editedReply}
            onChange={(e) => setEditedReply(e.target.value)}
            rows={4}
            aria-label={t("suggestedReply")}
            className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          {publishError && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle size={12} />
              {publishError}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePublish}
              disabled={loadingPublish || !editedReply.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors disabled:opacity-60"
            >
              {loadingPublish ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCircle2 size={14} />
              )}
              {t("publishReply")}
            </button>
            <button
              onClick={() => { setSuggestion(""); setEditedReply(""); }}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Flag modal */}
      {showFlagModal && !flagResult && (
        <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-100 space-y-3">
          <p className="text-xs font-semibold text-red-700">{t("flagModalTitle")}</p>
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder={t("flagPlaceholder")}
            rows={3}
            aria-label={t("flagModalTitle")}
            className="w-full text-sm border border-red-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleFlag}
              disabled={loadingFlag || !flagReason.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-60"
            >
              {loadingFlag ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Flag size={14} />
              )}
              {t("generateComplaint")}
            </button>
            <button
              onClick={() => setShowFlagModal(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Flag result */}
      {flagResult && (
        <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-100 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-red-700">{t("complaintGenerated")}</p>
            <CopyButton text={flagResult} copyLabel={t("copy")} copiedLabel={t("copied")} />
          </div>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-white rounded-lg p-3 border border-red-100">
            {flagResult}
          </pre>
          <a
            href={`mailto:business-support@google.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20rese%C3%B1a&body=${encodeURIComponent(flagResult)}`}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors w-fit"
          >
            <Mail size={14} />
            {t("openEmail")}
          </a>
        </div>
      )}
    </div>
  );
}
