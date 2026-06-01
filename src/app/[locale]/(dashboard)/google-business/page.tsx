"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { MapPin, RefreshCw, AlertTriangle, Loader2 } from "lucide-react";
import type { GoogleReview, ReviewAnalysis, Business } from "@/components/google-business/types";
import { TabButton } from "@/components/google-business/helpers";
import { ConnectPrompt } from "@/components/google-business/ConnectPrompt";
import { ProfileTab } from "@/components/google-business/ProfileTab";
import { ReviewsTab } from "@/components/google-business/ReviewsTab";
import { AnalysisTab } from "@/components/google-business/AnalysisTab";
import { FlaggedTab } from "@/components/google-business/FlaggedTab";

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
  const [loadingBusiness, setLoadingBusiness] = useState(true);
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
      } finally {
        setLoadingBusiness(false);
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

      {/* Tabs (mobile) */}
      <div className="lg:hidden flex gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto">
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
      {loadingBusiness ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <Loader2 size={20} className="animate-spin text-brand-600" />
        </div>
      ) : !connected ? (
        <ConnectPrompt onConnect={handleConnect} t={t} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
