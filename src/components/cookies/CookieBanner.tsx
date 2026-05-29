"use client";

import { Link } from "@/i18n/navigation";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { CookieSettingsModal } from "./CookieSettingsModal";
import { REJECT_ALL } from "@/lib/cookie-consent";
import { useTranslations } from "next-intl";

export function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const {
    showBanner, showSettings, openSettings, closeSettings,
    acceptAll, rejectAll, saveCustom, consent,
  } = useCookieConsent();

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {showBanner && !showSettings && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t("title")}
          className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 lg:p-8
                     pointer-events-none flex justify-center"
        >
          <div className="pointer-events-auto w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm sm:text-base mb-1">{t("title")}</p>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {t("desc")}{" "}
                  <Link href="/cookies" className="text-brand-600 hover:underline font-medium">
                    {t("settings")}
                  </Link>
                </p>
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  <button onClick={acceptAll} className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition">
                    {t("acceptAll")}
                  </button>
                  <button onClick={rejectAll} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-xl text-sm transition">
                    {t("rejectAll")}
                  </button>
                  <button onClick={openSettings} className="text-gray-500 hover:text-gray-800 font-medium text-sm underline underline-offset-2 transition px-1">
                    {t("configure")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
