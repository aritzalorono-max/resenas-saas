"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCaseStudies } from "@/lib/case-studies-data";

export function CaseStudiesCarousel() {
  const t = useTranslations("home");
  const locale = useLocale();
  const caseStudies = getCaseStudies(locale);
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateState = () => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const amount = (card?.offsetWidth ?? 400) + 16;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Flecha izquierda */}
      <button
        onClick={() => scroll("left")}
        disabled={!canPrev}
        aria-label={t("prevLabel")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10
                   w-10 h-10 rounded-full bg-white border-2 border-gray-200 shadow-md
                   flex items-center justify-center text-gray-700
                   hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50
                   disabled:opacity-0 disabled:pointer-events-none transition"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      {/* Flecha derecha */}
      <button
        onClick={() => scroll("right")}
        disabled={!canNext}
        aria-label={t("nextLabel")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10
                   w-10 h-10 rounded-full bg-white border-2 border-gray-200 shadow-md
                   flex items-center justify-center text-gray-700
                   hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50
                   disabled:opacity-0 disabled:pointer-events-none transition"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>

      <div
        ref={ref}
        onScroll={updateState}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {caseStudies.map(({ Icon, sector, name, challenge, result, stats }) => (
          <div
            data-card
            key={name}
            className="shrink-0 snap-center w-[88vw] sm:w-[72vw] lg:w-[48vw]
                       bg-white rounded-2xl border border-gray-100 hover:border-brand-200
                       transition-all overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-brand-600" strokeWidth={1.75} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">{sector}</span>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{name}</p>
                </div>
              </div>
            </div>

            {/* Before / After */}
            <div className="grid grid-cols-2 gap-0 divide-x divide-gray-100">
              <div className="p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">{t("casesBeforeLabel")}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{challenge}</p>
              </div>
              <div className="p-4 bg-brand-50/40">
                <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wide mb-1.5">{t("casesAfterLabel")}</p>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">{result}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
              {stats.map(({ label, value }) => (
                <div key={label} className="p-3 text-center">
                  <p className="text-xl font-extrabold text-gray-900">{value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
