"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Star,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Flag,
  MessageSquare,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Info,
  Link2,
  Clock,
  User,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GoogleReview {
  name: string;
  reviewId: string;
  reviewer: { displayName: string; isAnonymous?: boolean; profilePhotoUrl?: string };
  starRating: string;
  starRatingNum: number;
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: { comment: string; updateTime: string };
  replied: boolean;
  flagged: boolean;
  flagStatus: string | null;
}

interface ReviewAnalysis {
  overallSentiment: string;
  averageRating: number;
  reviewCount: number;
  ratingTrend: string;
  topPraises: string[];
  topComplaints: string[];
  profileSuggestions: string[];
}

interface Business {
  name: string;
  google_access_token: string | null;
  google_location_name: string | null;
  tone: string;
}

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}
        />
      ))}
    </span>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
        ${active
          ? "bg-gray-900 text-white"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
    >
      {children}
    </button>
  );
}

function CopyButton({ text, copyLabel, copiedLabel }: { text: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Connect prompt
// ---------------------------------------------------------------------------

function ConnectPrompt({ onConnect, t }: { onConnect: () => void; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
        <MapPin size={32} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {t("connectTitle")}
      </h2>
      <p className="text-gray-500 max-w-md mb-8">
        {t("connectDesc")}
      </p>
      <button
        onClick={onConnect}
        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
      >
        <MapPin size={18} />
        {t("connectBtn")}
      </button>
      <p className="mt-4 text-xs text-gray-400">
        {t("connectNote")}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 1: Resumen del perfil
// ---------------------------------------------------------------------------

function ProfileTab({
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
  t: ReturnType<typeof useTranslations>;
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
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-3">
          <Loader2 size={20} className="animate-spin text-brand-600" />
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

// ---------------------------------------------------------------------------
// Review card (shared)
// ---------------------------------------------------------------------------

function ReviewCard({
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
  t: ReturnType<typeof useTranslations>;
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

// ---------------------------------------------------------------------------
// Tab 2: Reviews without reply
// ---------------------------------------------------------------------------

function ReviewsTab({
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
  t: ReturnType<typeof useTranslations>;
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
      <div className="flex items-center justify-center py-16 gap-3">
        <Loader2 size={20} className="animate-spin text-brand-600" />
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
        <span className="text-xs text-gray-400 ml-2">
          {filtered.length} {filtered.length === 1 ? t("reviewSingular") : t("reviewPlural")}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
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

// ---------------------------------------------------------------------------
// Tab 3: Analysis
// ---------------------------------------------------------------------------

function AnalysisTab({
  analysis,
  loading,
  t,
}: {
  analysis: ReviewAnalysis | null;
  loading: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3">
        <Loader2 size={20} className="animate-spin text-brand-600" />
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

// ---------------------------------------------------------------------------
// Tab 4: Flagged reviews
// ---------------------------------------------------------------------------

function FlaggedTab({
  reviews,
  loading,
  error,
  t,
}: {
  reviews: GoogleReview[];
  loading: boolean;
  error: string;
  t: ReturnType<typeof useTranslations>;
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
      <div className="text-center py-12 text-gray-400">
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
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(review.createTime)}</p>
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

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function GoogleBusinessPage() {
  const t            = useTranslations("googleBusiness");
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tab = useMemo(() => {
    const v = searchParams.get("tab");
    if (v === "reviews" || v === "analysis" || v === "flagged") return v;
    return "profile" as const;
  }, [searchParams]);

  function setTab(next: "profile" | "reviews" | "analysis" | "flagged") {
    if (next === "profile") router.replace("/google-business");
    else router.replace(`/google-business?tab=${next}`);
  }

  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [connected, setConnected] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [urlError, setUrlError] = useState("");

  // Check for OAuth error in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err) {
      const msgs: Record<string, string> = {
        oauth_cancelled: t("errOauthCancelled"),
        missing_params: t("errMissingParams"),
        invalid_state: t("errInvalidState"),
        token_exchange: t("errTokenExchange"),
        db_save: t("errDbSave"),
      };
      setUrlError(msgs[err] ?? t("errUnknown"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load business info
  useEffect(() => {
    async function loadBusiness() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("businesses")
          .select("name, google_access_token, google_location_name, tone")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setBusiness(data as Business);
          setConnected(!!data.google_access_token && !!data.google_location_name);
        }
      } catch {
        // silent
      }
    }
    loadBusiness();
  }, []);

  // Load reviews when connected
  const loadReviews = useCallback(async () => {
    if (!connected) return;
    setLoadingReviews(true);
    setReviewsError("");
    try {
      const res = await fetch("/api/google-business/reviews");
      const data = await res.json();
      if (data.connected === false) {
        setConnected(false);
        setReviewsError(data.error ?? t("errDisconnected"));
      } else if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch {
      setReviewsError(t("errLoadReviews"));
    } finally {
      setLoadingReviews(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const loadAnalysis = useCallback(async () => {
    if (!connected) return;
    setLoadingAnalysis(true);
    try {
      const res = await fetch("/api/google-business/analyze");
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch {
      // silent
    } finally {
      setLoadingAnalysis(false);
    }
  }, [connected]);

  useEffect(() => {
    if (connected) {
      loadReviews();
      loadAnalysis();
    }
  }, [connected, loadReviews, loadAnalysis]);

  function handleConnect() {
    window.location.href = "/api/google-business/connect";
  }

  function handleReplyPublished(reviewName: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.name === reviewName ? { ...r, replied: true } : r
      )
    );
  }

  function handleFlagged(reviewName: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.name === reviewName
          ? { ...r, flagged: true, flagStatus: "pending" }
          : r
      )
    );
  }

  const unrepliedCount = reviews.filter((r) => !r.replied).length;
  const flaggedCount = reviews.filter((r) => r.flagged).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <MapPin size={22} className="text-brand-600" />
            {t("pageTitle")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("pageSubtitle")}
          </p>
        </div>
        {connected && (
          <button
            onClick={() => { loadReviews(); loadAnalysis(); }}
            disabled={loadingReviews || loadingAnalysis}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors disabled:opacity-60"
          >
            <RefreshCw size={14} className={loadingReviews ? "animate-spin" : ""} />
            {t("refresh")}
          </button>
        )}
      </div>

      {/* URL error */}
      {urlError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertTriangle size={18} />
          {urlError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto">
        <TabButton active={tab === "profile"} onClick={() => setTab("profile")}>
          {t("tabProfile")}
        </TabButton>
        <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
          {t("tabReviews")}{unrepliedCount > 0 && ` (${unrepliedCount})`}
        </TabButton>
        <TabButton active={tab === "analysis"} onClick={() => setTab("analysis")}>
          {t("tabAnalysis")}
        </TabButton>
        <TabButton active={tab === "flagged"} onClick={() => setTab("flagged")}>
          {t("tabFlagged")}{flaggedCount > 0 && ` (${flaggedCount})`}
        </TabButton>
      </div>

      {/* Tab content */}
      {tab === "profile" && (
        <ProfileTab
          business={business}
          analysis={analysis}
          loadingAnalysis={loadingAnalysis}
          onConnect={handleConnect}
          connected={connected}
          t={t}
        />
      )}

      {tab === "reviews" && (
        <ReviewsTab
          reviews={reviews}
          loading={loadingReviews}
          error={reviewsError}
          businessName={business?.name ?? ""}
          tone={business?.tone ?? "tuteo"}
          onReplyPublished={handleReplyPublished}
          onFlagged={handleFlagged}
          t={t}
        />
      )}

      {tab === "analysis" && (
        <AnalysisTab analysis={analysis} loading={loadingAnalysis} t={t} />
      )}

      {tab === "flagged" && (
        <FlaggedTab
          reviews={reviews}
          loading={loadingReviews}
          error={reviewsError}
          t={t}
        />
      )}
    </div>
  );
}
