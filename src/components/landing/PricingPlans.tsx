"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Star } from "lucide-react";

type Billing = "monthly" | "annual";

const plans = [
  {
    name: "Gratis",
    desc: "Para probar sin compromiso",
    monthly: 0,
    annual: 0,
    highlight: false,
    cta: "Empezar gratis",
    ctaHref: "/register",
    features: [
      { text: "50 solicitudes al mes", included: true },
      { text: "1 negocio", included: true },
      { text: "Google Maps, App Store, Play Store", included: true },
      { text: "Análisis de sentimiento con IA", included: true },
      { text: "Panel de métricas básico", included: true },
      { text: "Incentivos y códigos de descuento", included: false },
      { text: "Exportación de datos CSV", included: false },
      { text: "Soporte por email", included: false },
    ],
  },
  {
    name: "Negocio",
    desc: "Para negocios que quieren crecer",
    monthly: 39,
    annual: 29,
    highlight: true,
    badge: "Más popular",
    cta: "Probar 14 días gratis",
    ctaHref: "/register",
    features: [
      { text: "500 solicitudes al mes", included: true },
      { text: "1 negocio", included: true },
      { text: "Google · App Store · Play Store · Trustpilot", included: true },
      { text: "Análisis de sentimiento con IA", included: true },
      { text: "Panel de métricas completo", included: true },
      { text: "Incentivos y códigos de descuento", included: true },
      { text: "Exportación de datos CSV", included: true },
      { text: "Soporte por email", included: true },
    ],
  },
  {
    name: "Agencia",
    desc: "Para gestionar varios negocios",
    monthly: 99,
    annual: 79,
    highlight: false,
    cta: "Hablar con ventas",
    ctaHref: "/contacto",
    features: [
      { text: "Solicitudes ilimitadas", included: true },
      { text: "Hasta 10 negocios", included: true },
      { text: "Todas las plataformas", included: true },
      { text: "Análisis de sentimiento con IA", included: true },
      { text: "Panel multi-negocio", included: true },
      { text: "Incentivos y códigos de descuento", included: true },
      { text: "Exportación avanzada", included: true },
      { text: "Soporte prioritario", included: true },
    ],
  },
];

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setBilling("monthly")}
          className={`text-sm font-medium transition ${billing === "monthly" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
        >
          Mensual
        </button>
        <button
          onClick={() => setBilling(billing === "annual" ? "monthly" : "annual")}
          className={`relative w-11 h-6 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${billing === "annual" ? "bg-brand-600" : "bg-gray-200"}`}
          aria-label="Cambiar entre facturación mensual y anual"
          role="switch"
          aria-checked={billing === "annual"}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${billing === "annual" ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
        <button
          onClick={() => setBilling("annual")}
          className={`text-sm font-medium transition ${billing === "annual" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
        >
          Anual
          <span className="ml-1.5 text-xs font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
            −25%
          </span>
        </button>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
        {plans.map((plan) => {
          const price = billing === "annual" ? plan.annual : plan.monthly;
          const annualSaving = (plan.monthly - plan.annual) * 12;

          return (
            <div
              key={plan.name}
              className={`rounded-2xl p-7 flex flex-col relative ${
                plan.highlight
                  ? "bg-brand-600 text-white shadow-xl shadow-brand-200 ring-2 ring-brand-500"
                  : "bg-white border border-gray-100"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${plan.highlight ? "text-brand-200" : "text-brand-600"}`}>
                  {plan.name}
                </p>
                <p className={`text-sm mb-5 ${plan.highlight ? "text-brand-100" : "text-gray-500"}`}>
                  {plan.desc}
                </p>
                <div className="flex items-end gap-1 leading-none">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                    {price === 0 ? "0€" : `${price}€`}
                  </span>
                  {price > 0 && (
                    <span className={`text-sm mb-1 ${plan.highlight ? "text-brand-200" : "text-gray-400"}`}>
                      /mes
                    </span>
                  )}
                </div>
                {billing === "annual" && plan.annual > 0 ? (
                  <p className={`text-xs mt-2 ${plan.highlight ? "text-brand-200" : "text-gray-400"}`}>
                    Facturado {plan.annual * 12}€/año · ahorras {annualSaving}€
                  </p>
                ) : billing === "monthly" && plan.monthly > 0 ? (
                  <p className={`text-xs mt-2 ${plan.highlight ? "text-brand-200" : "text-gray-400"}`}>
                    Sin permanencia
                  </p>
                ) : price === 0 ? (
                  <p className={`text-xs mt-2 ${plan.highlight ? "text-brand-200" : "text-gray-400"}`}>
                    Para siempre gratuito
                  </p>
                ) : null}
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(({ text, included }) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm">
                    {included ? (
                      <Check
                        size={15}
                        className={`mt-0.5 shrink-0 ${plan.highlight ? "text-brand-200" : "text-brand-500"}`}
                        strokeWidth={2.5}
                      />
                    ) : (
                      <X size={15} className="mt-0.5 shrink-0 text-gray-300" strokeWidth={2.5} />
                    )}
                    <span
                      className={
                        included
                          ? plan.highlight ? "text-white" : "text-gray-700"
                          : "text-gray-400"
                      }
                    >
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`block text-center font-bold py-3 rounded-xl transition text-sm ${
                  plan.highlight
                    ? "bg-white text-brand-700 hover:bg-brand-50"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          );
        })}
      </div>

      {/* 75% Trustpilot launch offer */}
      <div className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row gap-5 items-start">

          {/* Left: icon + text */}
          <div className="flex gap-4 flex-1">
            <div className="w-11 h-11 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-900 fill-amber-900" />
            </div>
            <div>
              <p className="font-bold text-amber-900 text-base mb-1">
                Oferta de lanzamiento — 75% de descuento tu primer mes de pago
              </p>
              <p className="text-amber-800 text-sm leading-relaxed mb-4">
                Deja una reseña de{" "}
                <strong className="text-amber-900">5★ en Trustpilot</strong> sobre ReseñasYa
                y envíanos la captura por WhatsApp al{" "}
                <strong className="text-amber-900">xxx xxx xxx</strong>.
                Nuestra IA verifica las 5 estrellas automáticamente y aplicamos el descuento al instante.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {[
                  { n: "1", text: "Deja tu reseña de 5★ en Trustpilot" },
                  { n: "2", text: "Envía captura al WhatsApp" },
                  { n: "3", text: "75% dto. aplicado automáticamente" },
                ].map(({ n, text }) => (
                  <div key={n} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                      {n}
                    </div>
                    <span className="text-amber-800 text-xs font-semibold">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: discount badge */}
          <div className="shrink-0 bg-amber-400 text-amber-900 rounded-2xl px-5 py-4 text-center self-center sm:self-start">
            <p className="text-4xl font-extrabold leading-none">−75%</p>
            <p className="text-xs font-bold mt-1 uppercase tracking-wide">1 mes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
