"use client";

import { useRef, useState } from "react";
import { Star, TrendingUp, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "En solo 3 semanas pasamos de 47 a 89 reseñas en Google Maps. Lo mejor es que nos avisa si un cliente no está satisfecho antes de que lo publique en Google.",
    name: "Ana Martínez",
    role: "Propietaria",
    business: "La Taberna del Sol · Madrid",
    platform: "Google Maps",
    metric: "+42 reseñas en 3 semanas",
  },
  {
    quote: "Lo implantamos para nuestros usuarios activos y en 5 semanas subimos de 3.8 a 4.6★ en App Store. Los ratings son esenciales para el ASO y esto lo cambia todo.",
    name: "Javier Moreno",
    role: "CEO",
    business: "FinTrack App · Barcelona",
    platform: "App Store",
    metric: "3.8→4.6★ en App Store",
  },
  {
    quote: "Pusimos el incentivo: reseña de 5★ en Google + captura = 10% de descuento en la próxima cuota. La IA lo verifica sola y manda el código al instante. En un mes, 90 reseñas nuevas.",
    name: "Diego Herrera",
    role: "Director",
    business: "FitLife Gym · Sevilla",
    platform: "Google Maps + incentivo",
    metric: "90 reseñas en 1 mes",
  },
  {
    quote: "Como psicóloga necesitaba algo discreto. El tono de la IA es tan cálido que los pacientes responden con naturalidad. Ya tengo 38 reseñas nuevas en Google sin pedirlas yo directamente.",
    name: "Elena Domínguez",
    role: "Psicóloga",
    business: "Centro de Psicología Domínguez · Bilbao",
    platform: "Google Maps",
    metric: "+38 reseñas en 2 meses",
  },
  {
    quote: "Teníamos clientes muy contentos pero cero reseñas en Trustpilot — que es donde nos buscan antes de comprar. En 4 meses, 180 valoraciones con 4.7★. La conversión subió un 18%.",
    name: "Marta Giménez",
    role: "Fundadora",
    business: "BabyTrends · E-commerce",
    platform: "Trustpilot",
    metric: "180 reseñas en Trustpilot",
  },
  {
    quote: "El filtro de sentimiento es lo que más me gusta. Si un huésped no está contento, gestionamos el problema en privado. Las malas reseñas han caído un 80%.",
    name: "Miguel Fernández",
    role: "Director",
    business: "Hotel Boutique Costa · Málaga",
    platform: "Google Maps",
    metric: "−80% reseñas negativas",
  },
  {
    quote: "Nuestra app está en iOS y Android. Configuré dos enlaces: App Store y Play Store. El cliente elige. En 2 meses sumamos más de 500 valoraciones nuevas entre las dos plataformas.",
    name: "Pablo Torres",
    role: "Product Manager",
    business: "RecetApp · Madrid",
    platform: "App Store + Play Store",
    metric: "+500 valoraciones",
  },
  {
    quote: "Activamos el incentivo en la cafetería: captura de 5★ en Google = café de cortesía en la próxima visita, verificado automáticamente. En 3 semanas: de 31 a 97 reseñas.",
    name: "Lucía Fernández",
    role: "Propietaria",
    business: "Bloom Coffee · Zaragoza",
    platform: "Google Maps + incentivo",
    metric: "31→97 reseñas en 3 semanas",
  },
  {
    quote: "Enviamos WhatsApps a Google Maps y a Trustpilot según el perfil del paciente. Los más jóvenes van a Google, los mayores a Trustpilot. Tenemos presencia en las dos y cada vez más reseñas.",
    name: "Carlos Bernal",
    role: "Director médico",
    business: "Clínica Bernal · Alicante",
    platform: "Google + Trustpilot",
    metric: "+110 reseñas en 2 plataformas",
  },
  {
    quote: "Como despacho de abogados, la reputación digital es fundamental. Ahora tenemos más de 90 reseñas en Google y el 96% son de 5★. Ha cambiado completamente cómo nos encuentran los nuevos clientes.",
    name: "Patricia Olmedo",
    role: "Socia fundadora",
    business: "Olmedo & Asociados Abogados · Sevilla",
    platform: "Google Maps",
    metric: "96% reseñas de 5★",
  },
];

function platformBadgeClass(platform: string) {
  if (platform.includes("incentivo")) return "bg-amber-100 text-amber-700";
  if (platform.includes("+"))         return "bg-indigo-50 text-indigo-600";
  if (platform === "Trustpilot")      return "bg-emerald-50 text-emerald-700";
  if (platform === "App Store")       return "bg-blue-50 text-blue-600";
  if (platform === "Play Store")      return "bg-teal-50 text-teal-600";
  return "bg-green-50 text-green-700";
}

export function TestimonialsCarousel() {
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
    <div>
      {/* Scrollable row */}
      <div
        ref={ref}
        onScroll={updateState}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map(({ quote, name, role, business, metric, platform }) => (
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
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${platformBadgeClass(platform)}`}>
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

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <button
          onClick={() => scroll("left")}
          disabled={!canPrev}
          aria-label="Anterior"
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center
                     text-gray-500 hover:border-brand-300 hover:text-brand-600
                     disabled:opacity-30 disabled:cursor-default transition"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canNext}
          aria-label="Siguiente"
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center
                     text-gray-500 hover:border-brand-300 hover:text-brand-600
                     disabled:opacity-30 disabled:cursor-default transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
