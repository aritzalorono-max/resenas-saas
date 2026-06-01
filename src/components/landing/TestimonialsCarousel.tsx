"use client";

import { useRef, useState } from "react";
import { Star, TrendingUp, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getTestimonials, type TestimonialItem } from "@/content/testimonials-data";

function platformBadgeClass(type: TestimonialItem["platformType"]) {
  switch (type) {
    case "incentive":  return "bg-amber-100 text-amber-700";
    case "multi":      return "bg-indigo-50 text-indigo-600";
    case "trustpilot": return "bg-emerald-50 text-emerald-700";
    case "appstore":   return "bg-blue-50 text-blue-600";
    case "playstore":  return "bg-teal-50 text-teal-600";
    default:           return "bg-green-50 text-green-700";
  }
}

export function TestimonialsCarousel() {
  const t = useTranslations("home");
  const locale = useLocale();
  const testimonials = getTestimonials(locale);

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
    const amount = (card?.offsetWidth ?? 320) + 16;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
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
        {testimonials.map(({ quote, name, role, business, metric, platform, platformType }) => (
          <div
            data-card
            key={name}
            className="shrink-0 snap-center w-[82vw] sm:w-[42vw] lg:w-[30vw]
                       bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200
                       transition-all flex flex-col"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${platformBadgeClass(platformType)}`}>
                {platform}
              </span>
            </div>
            <Quote size={18} className="text-brand-200 mb-2 shrink-0" strokeWidth={1.5} />
            <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-4">{quote}</p>
            <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 w-fit">
              <TrendingUp size={12} strokeWidth={2.5} />
              {metric}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="font-semibold text-gray-900 text-sm">{name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{role} · {business}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
