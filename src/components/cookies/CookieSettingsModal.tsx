"use client";

import { useState } from "react";
import { X, ShieldCheck, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from "lucide-react";
import { COOKIE_CATEGORIES, ConsentPreferences } from "@/lib/cookie-consent";
import { useTranslations } from "next-intl";

interface Props {
  initialPrefs: ConsentPreferences;
  onSave: (prefs: ConsentPreferences) => void;
  onAcceptAll: () => void;
  onClose: () => void;
}

export function CookieSettingsModal({ initialPrefs, onSave, onAcceptAll, onClose }: Props) {
  const t = useTranslations("cookieBanner");
  const tc = useTranslations("cookieCategories");
  const [prefs, setPrefs] = useState<ConsentPreferences>(initialPrefs);
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(id: keyof ConsentPreferences) {
    setPrefs((p) => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden"
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h2 id="cookie-settings-title" className="font-bold text-gray-900 text-base">{t("settings")}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label={t("close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {COOKIE_CATEGORIES.map((cat) => {
            const isOpen    = expanded === cat.id;
            const isEnabled = cat.required ? true : prefs[cat.id as keyof ConsentPreferences];

            return (
              <div key={cat.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <button
                    className="flex-1 text-left"
                    onClick={() => setExpanded(isOpen ? null : cat.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{tc(`${cat.id}Label`)}</span>
                      {cat.required && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                          {t("alwaysActive")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug pr-2 line-clamp-2">
                      {tc(`${cat.id}Desc`)}
                    </p>
                  </button>

                  <div className="flex items-center gap-3 ml-3 shrink-0">
                    <button
                      onClick={() => setExpanded(isOpen ? null : cat.id)}
                      className="text-gray-300 hover:text-gray-500 transition"
                      aria-label={isOpen ? t("collapse") : t("expand")}
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      disabled={cat.required}
                      onClick={() => !cat.required && toggle(cat.id as keyof ConsentPreferences)}
                      aria-label={isEnabled ? t("deactivate") : t("activate")}
                      className="disabled:cursor-default"
                    >
                      {isEnabled
                        ? <ToggleRight className={`w-9 h-9 ${cat.required ? "text-green-400" : "text-brand-600"}`} />
                        : <ToggleLeft  className="w-9 h-9 text-gray-300" />}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{tc(`${cat.id}Desc`)}</p>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1.5">
                        {cat.required ? t("using") : t("mayActivate")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.examples.map((ex) => (
                          <span key={ex} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-0.5 text-gray-600">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5 shrink-0">
          <button
            onClick={() => onSave(prefs)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl transition text-sm"
          >
            {t("savePrefs")}
          </button>
          <button
            onClick={onAcceptAll}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition text-sm"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
