"use client";

import { useState } from "react";
import { CheckCircle2, Shield, Star, ShoppingBag, Sparkles } from "lucide-react";

type Tab = "positive" | "negative" | "incentive" | "ecommerce";

const TABS: {
  id: Tab;
  label: string;
  activeClass: string;
  inactiveClass: string;
  iconClass: string;
}[] = [
  {
    id: "positive",
    label: "Satisfecho",
    activeClass: "bg-green-100 text-green-700 border-2 border-green-200",
    inactiveClass: "bg-gray-100 text-gray-500 border-2 border-transparent",
    iconClass: "text-green-600",
  },
  {
    id: "negative",
    label: "Insatisfecho",
    activeClass: "bg-red-100 text-red-600 border-2 border-red-200",
    inactiveClass: "bg-gray-100 text-gray-500 border-2 border-transparent",
    iconClass: "text-red-500",
  },
  {
    id: "incentive",
    label: "Incentivo",
    activeClass: "bg-amber-100 text-amber-700 border-2 border-amber-200",
    inactiveClass: "bg-gray-100 text-gray-500 border-2 border-transparent",
    iconClass: "text-amber-500",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    activeClass: "bg-indigo-100 text-indigo-700 border-2 border-indigo-200",
    inactiveClass: "bg-gray-100 text-gray-500 border-2 border-transparent",
    iconClass: "text-indigo-500",
  },
];

export function ConversationTabs() {
  const [active, setActive] = useState<Tab>("positive");

  return (
    <>
      {/* ── Mobile: 2×2 tab grid ────────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-bold transition ${
                active === tab.id ? tab.activeClass : tab.inactiveClass
              }`}
            >
              {tab.id === "positive"  && <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${active === tab.id ? tab.iconClass : ""}`} />}
              {tab.id === "negative"  && <Shield       className={`w-3.5 h-3.5 shrink-0 ${active === tab.id ? tab.iconClass : ""}`} />}
              {tab.id === "incentive" && <Star         className={`w-3.5 h-3.5 shrink-0 fill-current ${active === tab.id ? tab.iconClass : ""}`} />}
              {tab.id === "ecommerce" && <ShoppingBag  className={`w-3.5 h-3.5 shrink-0 ${active === tab.id ? tab.iconClass : ""}`} />}
              {tab.label}
            </button>
          ))}
        </div>

        {active === "positive" && (
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
            <Bubble side="left" border>¡Hola María! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊</Bubble>
            <Bubble side="right">¡Muy buena! El café estaba riquísimo y el personal súper amable 😍</Bubble>
            <Bubble side="left" border>¡Qué alegría saber eso, María! 🙌 ¿Te animarías a dejar tu opinión en Google Maps? 👉 maps.google.com/...</Bubble>
          </div>
        )}

        {active === "negative" && (
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
            <Bubble side="left" border>¡Hola Carlos! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia hoy? 😊</Bubble>
            <Bubble side="right">La verdad no muy bien, tardaron mucho y el pedido llegó frío...</Bubble>
            <Bubble side="left" border>Gracias por tu honestidad, Carlos. Lamentamos que tu experiencia no haya sido la esperada 😔 Tu opinión es muy valiosa para mejorar. ¡Esperamos poder verte pronto! 🙏</Bubble>
          </div>
        )}

        {active === "incentive" && (
          <div className="bg-amber-50 rounded-2xl p-5 space-y-3 border border-amber-100">
            <Bubble side="left" borderAmber>¡Hola Sara! Soy el equipo de Barbería Styles. ¿Cómo fue tu visita hoy? 😊</Bubble>
            <Bubble side="right">¡Genial! Muy contenta con el corte, quedó perfecto 🥰</Bubble>
            <Bubble side="left" borderAmber>¡Nos alegra mucho, Sara! 🌟 Si dejas una reseña de 5★ en Google Maps y nos envías una captura, te regalamos un <strong>20% de descuento</strong> en tu próxima visita. 👉 maps.google.com/...</Bubble>
            <Bubble side="right">📸 ¡Aquí la captura!</Bubble>
            <Bubble side="left" borderAmber>✅ <strong>¡Captura verificada!</strong> Tu 20% de descuento está reservado. ¡Hasta pronto, Sara! 🎉</Bubble>
            <p className="text-xs text-amber-600 font-medium text-center pt-1">La IA verifica automáticamente las 5★</p>
          </div>
        )}

        {active === "ecommerce" && (
          <div className="bg-[#e5ddd5] rounded-2xl p-5 space-y-3">
            <p className="text-xs text-gray-500 text-center mb-1">El cliente escribe primero — tú solo verificas y recompensas</p>
            <Bubble side="right">
              <span className="flex items-center gap-2">
                <span className="text-lg">📸</span>
                <span>¡Aquí mi reseña de 5★ en Google!</span>
              </span>
            </Bubble>
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs text-gray-500 italic">IA verificando la reseña…</p>
            </div>
            <Bubble side="left" borderIndigo>
              <p className="font-semibold text-green-600 text-xs mb-1.5">✅ ¡Reseña de 5★ confirmada!</p>
              <p className="text-xs text-gray-700 mb-2">Aquí tienes tu regalo como prometimos:</p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 text-center">
                <p className="text-[10px] text-indigo-500 font-medium uppercase tracking-wide">Código de descuento</p>
                <p className="text-base font-extrabold font-mono text-indigo-700 tracking-widest">GRACIAS25</p>
                <p className="text-[10px] text-indigo-400">25% dto. · Válido 30 días</p>
              </div>
            </Bubble>
            <Bubble side="right">¡Wow, qué rápido! 😍 Muchas gracias 🙌</Bubble>
          </div>
        )}
      </div>

      {/* ── Desktop: 2×2 grid ───────────────────────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">

        {/* Satisfecho */}
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-green-600 mb-3 uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} />
            Satisfecho → reseña en Google Maps
          </p>
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100 h-full">
            <Bubble side="left" border>¡Hola María! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊</Bubble>
            <Bubble side="right">¡Muy buena! El café estaba riquísimo y el personal súper amable 😍</Bubble>
            <Bubble side="left" border>¡Qué alegría saber eso, María! 🙌 ¿Te animarías a dejar tu opinión en Google Maps? 👉 maps.google.com/...</Bubble>
          </div>
        </div>

        {/* Insatisfecho */}
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-red-500 mb-3 uppercase tracking-wide">
            <Shield className="w-4 h-4 shrink-0" strokeWidth={2} />
            Insatisfecho → respuesta empática, sin enlace
          </p>
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100 h-full">
            <Bubble side="left" border>¡Hola Carlos! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia hoy? 😊</Bubble>
            <Bubble side="right">La verdad no muy bien, tardaron mucho y el pedido llegó frío...</Bubble>
            <Bubble side="left" border>Gracias por tu honestidad, Carlos. Lamentamos que tu experiencia no haya sido la esperada 😔 Tu opinión es muy valiosa para mejorar. ¡Esperamos poder verte pronto! 🙏</Bubble>
          </div>
        </div>

        {/* Incentivo */}
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-600 mb-3 uppercase tracking-wide">
            <Star className="w-4 h-4 shrink-0 fill-amber-400 text-amber-400" strokeWidth={2} />
            Incentivo → reseña 5★ verificada y código enviado
          </p>
          <div className="bg-amber-50 rounded-2xl p-5 space-y-3 border border-amber-100">
            <Bubble side="left" borderAmber>¡Hola Sara! Soy el equipo de Barbería Styles. ¿Cómo fue tu visita hoy? 😊</Bubble>
            <Bubble side="right">¡Genial! Muy contenta con el corte, quedó perfecto 🥰</Bubble>
            <Bubble side="left" borderAmber>¡Nos alegra mucho, Sara! 🌟 Si dejas una reseña de 5★ en Google Maps y nos envías una captura, te regalamos un <strong>20% de descuento</strong> en tu próxima visita. 👉 maps.google.com/...</Bubble>
            <Bubble side="right">📸 ¡Aquí la captura!</Bubble>
            <Bubble side="left" borderAmber>✅ <strong>¡Captura verificada!</strong> Tu 20% de descuento está reservado. ¡Hasta pronto, Sara! 🎉</Bubble>
            <p className="text-xs text-amber-600 font-medium text-center pt-1">La IA verifica automáticamente las 5★ antes de enviar la recompensa</p>
          </div>
        </div>

        {/* E-commerce */}
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">
            <ShoppingBag className="w-4 h-4 shrink-0" strokeWidth={2} />
            E-commerce → el cliente escribe primero
          </p>
          <div className="bg-[#e5ddd5] rounded-2xl p-5 space-y-3 shadow-inner">
            <p className="text-xs text-gray-500 text-center">El cliente vio la oferta en tu tienda y escribe directamente</p>
            <Bubble side="right">
              <span className="flex items-center gap-2">
                <span className="text-lg">📸</span>
                <span>¡Aquí mi reseña de 5★ en Google!</span>
              </span>
            </Bubble>
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs text-gray-500 italic">IA verificando la reseña…</p>
            </div>
            <Bubble side="left" borderIndigo>
              <p className="font-semibold text-green-600 text-xs mb-1.5">✅ ¡Reseña de 5★ confirmada!</p>
              <p className="text-xs text-gray-700 mb-2">Muchas gracias. Como prometimos, aquí tu regalo:</p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 text-center">
                <p className="text-[10px] text-indigo-500 font-medium uppercase tracking-wide">Código de descuento</p>
                <p className="text-base font-extrabold font-mono text-indigo-700 tracking-widest">GRACIAS25</p>
                <p className="text-[10px] text-indigo-400">25% dto. · Válido 30 días</p>
              </div>
            </Bubble>
            <Bubble side="right">¡Wow, qué rápido! 😍 Muchas gracias 🙌</Bubble>
            <p className="text-xs text-indigo-500 font-medium text-center pt-1">&lt; 5 segundos desde que el cliente envía la captura hasta recibir el código</p>
          </div>
        </div>

      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chat bubble helper
// ─────────────────────────────────────────────────────────────────────────────

function Bubble({
  side, border, borderAmber, borderIndigo, children,
}: {
  side: "left" | "right";
  border?: boolean;
  borderAmber?: boolean;
  borderIndigo?: boolean;
  children: React.ReactNode;
}) {
  if (side === "right") {
    return (
      <div className="flex justify-end">
        <div className="bg-brand-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-xs text-sm shadow-sm">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className={`rounded-2xl rounded-tl-none px-4 py-3 max-w-xs text-sm shadow-sm bg-white ${
        borderIndigo ? "border border-indigo-100" :
        borderAmber  ? "border border-amber-100"  :
        border       ? "border border-gray-100"   : ""
      }`}>
        {children}
      </div>
    </div>
  );
}
