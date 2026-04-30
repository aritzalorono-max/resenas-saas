"use client";

import { useState } from "react";
import { CheckCircle2, Shield, Star, ShoppingBag, Sparkles } from "lucide-react";

type Tab = "positive" | "negative" | "incentive" | "ecommerce";

const TABS: {
  id: Tab;
  label: string;
  sublabel: string;
  activeClass: string;
  inactiveClass: string;
  iconClass: string;
}[] = [
  {
    id: "positive",
    label: "Satisfecho",
    sublabel: "→ pide reseña",
    activeClass: "bg-green-100 text-green-700 border-green-200",
    inactiveClass: "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
    iconClass: "text-green-600",
  },
  {
    id: "negative",
    label: "Insatisfecho",
    sublabel: "→ gestión privada",
    activeClass: "bg-red-100 text-red-600 border-red-200",
    inactiveClass: "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
    iconClass: "text-red-500",
  },
  {
    id: "incentive",
    label: "Incentivo",
    sublabel: "→ código automático",
    activeClass: "bg-amber-100 text-amber-700 border-amber-200",
    inactiveClass: "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
    iconClass: "text-amber-500",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    sublabel: "→ cliente inicia",
    activeClass: "bg-indigo-100 text-indigo-700 border-indigo-200",
    inactiveClass: "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
    iconClass: "text-indigo-500",
  },
];

export function ConversationTabs() {
  const [active, setActive] = useState<Tab>("positive");

  return (
    <div className="flex flex-col items-center gap-6">

      {/* Tab pills */}
      <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full sm:w-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-1.5
              px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold border transition
              ${active === tab.id ? tab.activeClass : tab.inactiveClass}`}
          >
            {tab.id === "positive"  && <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${active === tab.id ? tab.iconClass : "text-gray-400"}`} />}
            {tab.id === "negative"  && <Shield       className={`w-3.5 h-3.5 shrink-0 ${active === tab.id ? tab.iconClass : "text-gray-400"}`} />}
            {tab.id === "incentive" && <Star         className={`w-3.5 h-3.5 shrink-0 fill-current ${active === tab.id ? tab.iconClass : "text-gray-400"}`} />}
            {tab.id === "ecommerce" && <ShoppingBag  className={`w-3.5 h-3.5 shrink-0 ${active === tab.id ? tab.iconClass : "text-gray-400"}`} />}
            <span>{tab.label}</span>
            <span className={`hidden sm:inline text-[10px] font-normal opacity-70`}>{tab.sublabel}</span>
          </button>
        ))}
      </div>

      {/* Conversation panel */}
      <div className="w-full max-w-sm">
        {active === "positive" && (
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
            <p className="text-[11px] text-gray-400 text-center font-medium uppercase tracking-wide mb-1">Cliente satisfecho · Google Maps</p>
            <Bubble side="left" border>¡Hola María! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia hoy? 😊</Bubble>
            <Bubble side="right">¡Muy buena! El café riquísimo y el personal súper amable 😍</Bubble>
            <Bubble side="left" border>¡Qué alegría, María! 🙌 ¿Te animarías a dejar tu opinión en Google Maps? 👉 maps.google.com/...</Bubble>
            <p className="text-[11px] text-green-600 font-medium text-center pt-1">✓ Cliente dirigido a la plataforma de reseñas</p>
          </div>
        )}

        {active === "negative" && (
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
            <p className="text-[11px] text-gray-400 text-center font-medium uppercase tracking-wide mb-1">Cliente insatisfecho · sin enlace público</p>
            <Bubble side="left" border>¡Hola Carlos! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia hoy? 😊</Bubble>
            <Bubble side="right">La verdad no muy bien, tardaron mucho y el pedido llegó frío...</Bubble>
            <Bubble side="left" border>Gracias por tu honestidad, Carlos. Lamentamos que no fuera lo esperado 😔 Tu opinión nos ayuda a mejorar. ¡Esperamos verte pronto! 🙏</Bubble>
            <p className="text-[11px] text-red-500 font-medium text-center pt-1">✓ Feedback recibido en privado, sin daño a la reputación</p>
          </div>
        )}

        {active === "incentive" && (
          <div className="bg-amber-50 rounded-2xl p-5 space-y-3 border border-amber-100">
            <p className="text-[11px] text-amber-600 text-center font-medium uppercase tracking-wide mb-1">Incentivo · código verificado por IA</p>
            <Bubble side="left" borderAmber>¡Hola Sara! Soy Barbería Styles. ¿Cómo fue tu visita? 😊</Bubble>
            <Bubble side="right">¡Genial! Muy contenta con el corte 🥰</Bubble>
            <Bubble side="left" borderAmber>¡Genial Sara! 🌟 Deja una reseña de 5★ y envíanos captura → <strong>20% dto.</strong> en tu próxima visita. 👉 maps.google.com/...</Bubble>
            <Bubble side="right">📸 ¡Aquí la captura!</Bubble>
            <Bubble side="left" borderAmber>✅ <strong>¡Verificado!</strong> Tu 20% de descuento está reservado. ¡Hasta pronto! 🎉</Bubble>
            <p className="text-[11px] text-amber-600 font-medium text-center pt-1">✓ La IA verifica las 5★ antes de enviar la recompensa</p>
          </div>
        )}

        {active === "ecommerce" && (
          <div className="bg-[#e5ddd5] rounded-2xl p-5 space-y-3">
            <p className="text-[11px] text-gray-500 text-center font-medium uppercase tracking-wide mb-1">E-commerce · el cliente escribe primero</p>
            <Bubble side="right">
              <span className="flex items-center gap-2">
                <span className="text-base">📸</span>
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
              <p className="text-xs text-gray-700 mb-2">Aquí tu regalo como prometimos:</p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 text-center">
                <p className="text-[10px] text-indigo-500 font-medium uppercase tracking-wide">Código de descuento</p>
                <p className="text-base font-extrabold font-mono text-indigo-700 tracking-widest">GRACIAS25</p>
                <p className="text-[10px] text-indigo-400">25% dto. · Válido 30 días</p>
              </div>
            </Bubble>
            <Bubble side="right">¡Wow, qué rápido! 😍 Muchas gracias 🙌</Bubble>
            <p className="text-[11px] text-indigo-500 font-medium text-center pt-1">✓ &lt; 5 segundos desde la captura hasta el código</p>
          </div>
        )}
      </div>
    </div>
  );
}

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
        <div className="bg-brand-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[260px] text-sm shadow-sm">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className={`rounded-2xl rounded-tl-none px-4 py-3 max-w-[260px] text-sm shadow-sm bg-white ${
        borderIndigo ? "border border-indigo-100" :
        borderAmber  ? "border border-amber-100"  :
        border       ? "border border-gray-100"   : ""
      }`}>
        {children}
      </div>
    </div>
  );
}
