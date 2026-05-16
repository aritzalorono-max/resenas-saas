import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Gratis",
    tagline: "Para probar",
    price: "0",
    requests: "5 WhatsApp / mes",
    highlight: false,
    cta: "Empezar gratis",
    ctaHref: "/register",
    features: [
      "Google Maps",
      "Análisis de sentimiento con IA",
      "Panel de métricas",
    ],
  },
  {
    name: "Starter",
    tagline: "Para pequeños negocios",
    price: "9,9",
    requests: "50 contactos / mes",
    highlight: false,
    cta: "Empezar",
    ctaHref: "/register",
    features: [
      "Google Maps, App Store, Play Store",
      "Análisis de sentimiento con IA",
      "Panel de métricas",
      "Soporte email",
    ],
  },
  {
    name: "Pro",
    tagline: "El más completo",
    price: "29,9",
    requests: "250 contactos / mes",
    highlight: true,
    badge: "Más popular",
    cta: "Empezar",
    ctaHref: "/register",
    features: [
      "Todas las plataformas",
      "Análisis de sentimiento con IA",
      "Incentivos y códigos de descuento",
      "Exportación CSV · Soporte prioritario",
    ],
  },
];

export function PricingPlans() {
  return (
    <div>
      {/* Cards — horizontal carousel on mobile, 3-col grid on md+ */}
      <div className="
        flex overflow-x-auto snap-x snap-mandatory gap-4 pt-5 pb-4 -mx-6 px-6
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        md:grid md:grid-cols-3 md:gap-6
        md:overflow-visible md:pt-5 md:pb-0 md:mx-0 md:px-0
      ">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`shrink-0 w-[72vw] snap-center md:w-auto
              rounded-2xl p-6 flex flex-col relative
              ${plan.highlight
                ? "bg-brand-600 text-white shadow-xl shadow-brand-200 ring-2 ring-brand-500"
                : "bg-white border border-gray-100 hover:border-brand-200 transition-colors"
              }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Name */}
            <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${plan.highlight ? "text-brand-200" : "text-brand-600"}`}>
              {plan.name}
            </p>
            <p className={`text-xs mb-5 ${plan.highlight ? "text-brand-100" : "text-gray-500"}`}>
              {plan.tagline}
            </p>

            {/* Price */}
            <div className="flex items-end gap-1 mb-2 leading-none">
              <span className={`text-5xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                {plan.price}€
              </span>
              <span className={`text-sm mb-1.5 ${plan.highlight ? "text-brand-200" : "text-gray-500"}`}>
                /mes
              </span>
            </div>

            {/* Volume badge */}
            <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full mb-6 w-fit ${
              plan.highlight ? "bg-white/20 text-white" : "bg-brand-50 text-brand-700"
            }`}>
              {plan.requests}
            </span>

            {/* Features */}
            <ul className="space-y-2.5 flex-1 mb-7">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2 text-sm">
                  <Check
                    size={14}
                    className={`mt-0.5 shrink-0 ${plan.highlight ? "text-brand-200" : "text-brand-500"}`}
                    strokeWidth={2.5}
                  />
                  <span className={plan.highlight ? "text-white/90" : "text-gray-600"}>{feat}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.ctaHref}
              className={`block text-center font-bold py-2.5 rounded-xl transition text-sm ${
                plan.highlight
                  ? "bg-white text-brand-700 hover:bg-brand-50"
                  : "bg-brand-600 text-white hover:bg-brand-700"
              }`}
            >
              {plan.cta} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
