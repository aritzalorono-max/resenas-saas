"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function GenerateButton({ hasReport }: { hasReport: boolean }) {
  const t      = useTranslations("informes");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const router                = useRouter();

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? t("errorGenerating"));
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorUnknown"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60
                   disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-xl
                   transition-all active:scale-[0.98] shadow-sm"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? t("analyzing") : hasReport ? t("regenerate") : t("generate")}
      </button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      {loading && (
        <p className="text-xs text-gray-400">{t("analyzingNote")}</p>
      )}
    </div>
  );
}
