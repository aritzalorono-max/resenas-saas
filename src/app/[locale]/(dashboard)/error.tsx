"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("[ResenasYa] Error en el dashboard:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm w-full shadow-card">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" strokeWidth={1.75} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">{t("title")}</h2>
        <p className="text-sm text-gray-500 mb-6">{t("body")}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            {t("retry")}
          </button>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            {t("back")}
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-gray-300 mt-4 font-mono">ref: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
