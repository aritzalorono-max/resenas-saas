"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { CookieSettingsModal } from "./CookieSettingsModal";
import { REJECT_ALL } from "@/lib/cookie-consent";

export function CookieBanner() {
  const {
    showBanner,
    showSettings,
    openSettings,
    closeSettings,
    acceptAll,
    rejectAll,
    saveCustom,
    consent,
  } = useCookieConsent();

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* ── Banner principal ───────────────────────────────────────────────── */}
      {showBanner && !showSettings && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Aviso de cookies"
          className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 lg:p-8
                     pointer-events-none flex justify-center"
        >
          <div className="pointer-events-auto w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-amber-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                  Usamos cookies
                </p>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  Usamos cookies propias para el funcionamiento de la plataforma (siempre activas).
                  También podemos usar cookies analíticas y de marketing con tu consentimiento.{" "}
                  <Link href="/cookies" className="text-brand-600 hover:underline font-medium">
                    Política de cookies
                  </Link>
                </p>

                {/* Buttons */}
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  <button
                    onClick={acceptAll}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
                  >
                    Aceptar todas
                  </button>
                  <button
                    onClick={rejectAll}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-xl text-sm transition"
                  >
                    Solo necesarias
                  </button>
                  <button
                    onClick={openSettings}
                    className="text-gray-500 hover:text-gray-800 font-medium text-sm underline underline-offset-2 transition px-1"
                  >
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de configuración granular ───────────────────────────────── */}
      {showSettings && (
        <CookieSettingsModal
          initialPrefs={consent ?? REJECT_ALL}
          onSave={saveCustom}
          onAcceptAll={acceptAll}
          onClose={closeSettings}
        />
      )}
    </>
  );
}
