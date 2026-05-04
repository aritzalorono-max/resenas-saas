"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export function GenerateButton({ hasReport }: { hasReport: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const router                = useRouter();

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-report", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Error generando informe");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
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
        {loading
          ? "Analizando…"
          : hasReport
            ? "Regenerar informe"
            : "Generar informe"}
      </button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      {loading && (
        <p className="text-xs text-gray-400">Analizando conversaciones con IA… puede tardar ~30 s</p>
      )}
    </div>
  );
}
