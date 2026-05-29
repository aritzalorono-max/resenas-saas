"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, TrendingUp, Utensils, Dumbbell, ShoppingBag, Stethoscope, Smartphone, Coffee } from "lucide-react";

const caseStudies = [
  {
    Icon: Utensils,
    sector: "Restauración · Google Maps",
    name: "Pizzería Napoli · Sevilla",
    before: "23 reseñas en 2 años. Solo llegaban en momentos de queja.",
    after: "97 reseñas y 4.7★ en 2 meses. Apareció en el top 3 local y llenó la lista de espera los fines de semana.",
    stats: [
      { label: "Reseñas nuevas", value: "+74" },
      { label: "Media Google", value: "4.7★" },
      { label: "Tiempo", value: "2 meses" },
    ],
  },
  {
    Icon: Dumbbell,
    sector: "Fitness · Google Maps + Incentivo",
    name: "FitBody Gym · Valencia",
    before: "58 reseñas en 4 años con NPS de 72. Los socios estaban satisfechos pero no dejaban valoraciones.",
    after: "Incentivo: 5★ + captura = 10% dto. en cuota. La IA verifica y envía el código al instante. 134 reseñas en 6 semanas.",
    stats: [
      { label: "Reseñas nuevas", value: "+134" },
      { label: "Media Google", value: "4.9★" },
      { label: "Conversión incentivo", value: "62%" },
    ],
  },
  {
    Icon: ShoppingBag,
    sector: "E-commerce · Trustpilot",
    name: "ModaTrend · Barcelona",
    before: "Alta satisfacción pero cero presencia en Trustpilot, donde sus compradores decidían si comprar.",
    after: "WhatsApp automático 48 h post-entrega. En 4 meses: 289 valoraciones con 4.7★ y +22% de conversión.",
    stats: [
      { label: "Reseñas Trustpilot", value: "289" },
      { label: "Media", value: "4.7★" },
      { label: "Conversión web", value: "+22%" },
    ],
  },
  {
    Icon: Stethoscope,
    sector: "Salud · Google Maps + Trustpilot",
    name: "Clínica Dental Ortiz · Zaragoza",
    before: "Sector sensible: necesitaban captar opiniones positivas sin que las negativas llegaran a publicarse.",
    after: "62 reseñas nuevas en 4 meses. Las opiniones negativas se gestionaron en privado. Ninguna llegó a publicarse.",
    stats: [
      { label: "Reseñas nuevas", value: "+62" },
      { label: "Reseñas negativas públicas", value: "0" },
      { label: "Satisfacción", value: "94%" },
    ],
  },
  {
    Icon: Smartphone,
    sector: "App móvil · App Store + Play Store",
    name: "RecetApp · Madrid",
    before: "18.000 usuarios activos pero solo 312 valoraciones en total. Ratio bajo que lastraba el ranking.",
    after: "WhatsApps por dispositivo: App Store para iOS, Play Store para Android. +520 valoraciones y top 10 en su categoría.",
    stats: [
      { label: "Valoraciones nuevas", value: "+520" },
      { label: "Plataformas", value: "2" },
      { label: "Posición", value: "Top 10" },
    ],
  },
  {
    Icon: Coffee,
    sector: "Cafetería · Google Maps + Incentivo",
    name: "Bloom Coffee · Zaragoza",
    before: "31 reseñas y 4.2★. La competencia de enfrente tenía 180 y aparecía siempre primera en Google.",
    after: "5★ + captura = café de cortesía verificado por IA. Sin fricción. De 31 a 97 reseñas y 4.8★ en 3 semanas.",
    stats: [
      { label: "Reseñas nuevas", value: "+66" },
      { label: "Media Google", value: "4.8★" },
      { label: "Tiempo", value: "3 semanas" },
    ],
  },
];

export function CaseStudiesCarousel() {
  const t = useTranslations("home");
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
        aria-label="Anterior"
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
        aria-label="Siguiente"
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
        {caseStudies.map(({ Icon, sector, name, before, after, stats }) => (
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
                <p className="text-xs text-gray-600 leading-relaxed">{before}</p>
              </div>
              <div className="p-4 bg-brand-50/40">
                <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wide mb-1.5">{t("casesAfterLabel")}</p>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">{after}</p>
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
