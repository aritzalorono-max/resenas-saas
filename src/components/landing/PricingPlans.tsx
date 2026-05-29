"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

const planKeys = [
  {
    name: "Gratis",
    nameKey: null,
    taglineKey: "taglineFree",
    price: "0",
    requestsKey: "requestsFree",
    highlight: false,
    ctaKey: "ctaFree",
    ctaHref: "/register",
    featureKeys: ["featMaps", "featAI", "featMetrics"],
  },
  {
    name: "Starter",
    nameKey: null,
    taglineKey: "taglineStarter",
    price: "9,9",
    requestsKey: "requestsStarter",
    highlight: false,
    ctaKey: "ctaPaid",
    ctaHref: "/register",
    featureKeys: ["featMapsPlus", "featAI", "featMetrics", "featEmail"],
  },
  {
    name: "Pro",
    nameKey: null,
    taglineKey: "taglinePro",
    price: "29,9",
    requestsKey: "requestsPro",
    highlight: true,
    ctaKey: "ctaPaid",
    ctaHref: "/register",
    featureKeys: ["featAllPlatforms", "featAI", "featIncentives", "featExport"],
  },
] as const;

export function PricingPlans() {
  const t = useTranslations("precios");

  return (
    <div>
      {/* Cards — horizontal carousel on mobile, 3-col grid on md+ */}
      <div className="
        flex overflow-x-auto snap-x snap-mandatory gap-4 pt-5 pb-4 -mx-6 px-6
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        md:grid md:grid-cols-3 md:gap-6
        md:overflow-visible md:pt-5 md:pb-0 md:mx-0 md:px-0
      ">
        {planKeys.map((plan) => (
          <div
            key={plan.name}
            className={`shrink-0 w-[72vw] snap-center md:w-auto
              rounded-2xl p-6 flex flex-col relative
              ${plan.highlight
                ? "bg-brand-600 text-white shadow-xl shadow-brand-200 ring-2 ring-brand-500"
                : "bg-white border border-gray-100 hover:border-brand-200 transition-colors"
              }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {t("popular")}
                </span>
              </div>
            )}

            {/* Name */}
            <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${plan.highlight ? "text-brand-200" : "text-brand-600"}`}>
              {plan.name}
            </p>
            <p className={`text-xs mb-5 ${plan.highlight ? "text-brand-100" : "text-gray-500"}`}>
              {t(plan.taglineKey)}
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
              {t(plan.requestsKey)}
            </span>

            {/* Features */}
            <ul className="space-y-2.5 flex-1 mb-7">
              {plan.featureKeys.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm">
                  <Check
                    size={14}
                    className={`mt-0.5 shrink-0 ${plan.highlight ? "text-brand-200" : "text-brand-500"}`}
                    strokeWidth={2.5}
                  />
                  <span className={plan.highlight ? "text-white/90" : "text-gray-600"}>{t(key)}</span>
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
              {t(plan.ctaKey)} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
