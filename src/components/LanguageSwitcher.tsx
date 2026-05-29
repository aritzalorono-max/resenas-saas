"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useTransition, useState, useRef, useEffect } from "react";

const LOCALE_LABELS: Record<string, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
};

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleOpen() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;
    function onScroll() { setOpen(false); }
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true });
  }, [open]);

  function handleSelect(nextLocale: string) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        disabled={isPending}
        aria-label={t("languageSwitcher")}
        className={`flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition rounded-lg border border-gray-200 hover:border-gray-300 px-2.5 py-1.5 hover:bg-gray-50 ${
          isPending ? "opacity-50" : ""
        }`}
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className={compact ? "text-xs uppercase" : "text-xs font-semibold uppercase"}>
          {locale}
        </span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-[61]"
            style={dropdownStyle}
          >
            {routing.locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition flex items-center gap-2 ${
                  loc === locale ? "text-brand-700 font-semibold bg-brand-50" : "text-gray-700"
                }`}
              >
                <span className="text-xs w-6 uppercase font-mono text-gray-400">{loc}</span>
                {LOCALE_LABELS[loc]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
