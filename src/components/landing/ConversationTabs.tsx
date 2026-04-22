"use client";

import { useState } from "react";
import { CheckCircle2, Shield, Star } from "lucide-react";

type Tab = "positive" | "negative" | "incentive";

const TAB_STYLES: Record<Tab, { active: string; inactive: string; label: string; icon: string }> = {
  positive:  { active: "bg-green-100 text-green-700 border-2 border-green-200",  inactive: "bg-gray-100 text-gray-500 border-2 border-transparent", label: "Satisfecho",   icon: "text-green-600"  },
  negative:  { active: "bg-red-100 text-red-600 border-2 border-red-200",        inactive: "bg-gray-100 text-gray-500 border-2 border-transparent", label: "Insatisfecho", icon: "text-red-500"    },
  incentive: { active: "bg-amber-100 text-amber-700 border-2 border-amber-200",  inactive: "bg-gray-100 text-gray-500 border-2 border-transparent", label: "Incentivo",    icon: "text-amber-500"  },
};

export function ConversationTabs() {
  const [active, setActive] = useState<Tab>("positive");

  return (
    <>
      {/* ── Mobile: tab switcher ────────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="flex gap-2 mb-5">
          {(["positive", "negative", "incentive"] as Tab[]).map((tab) => {
            const s = TAB_STYLES[tab];
            return (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-bold transition ${
                  active === tab ? s.active : s.inactive
                }`}
              >
                {tab === "positive"  && <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${active === tab ? s.icon : ""}`} />}
                {tab === "negative"  && <Shield       className={`w-3.5 h-3.5 shrink-0 ${active === tab ? s.icon : ""}`} />}
                {tab === "incentive" && <Star         className={`w-3.5 h-3.5 shrink-0 fill-current ${active === tab ? s.icon : ""}`} />}
                {s.label}
              </button>
            );
          })}
        </div>

        {active === "positive" && (
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
            <Bubble side="left"  bg="white" border>¡Hola María! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊</Bubble>
            <Bubble side="right" bg="brand">¡Muy buena! El café estaba riquísimo y el personal súper amable 😍</Bubble>
            <Bubble side="left"  bg="white" border>¡Qué alegría saber eso, María! 🙌 ¿Te animarías a dejar tu opinión en Google Maps? 👉 maps.google.com/...</Bubble>
          </div>
        )}

        {active === "negative" && (
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
            <Bubble side="left"  bg="white" border>¡Hola Carlos! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia hoy? 😊</Bubble>
            <Bubble side="right" bg="brand">La verdad no muy bien, tardaron mucho y el pedido llegó frío...</Bubble>
            <Bubble side="left"  bg="white" border>Gracias por tu honestidad, Carlos. Lamentamos que tu experiencia no haya sido la esperada 😔 Tu opinión es muy valiosa para mejorar. ¡Esperamos poder verte pronto! 🙏</Bubble>
          </div>
        )}

        {active === "incentive" && (
          <div className="bg-amber-50 rounded-2xl p-5 space-y-3 border border-amber-100">
            <Bubble side="left"  bg="white" borderAmber>¡Hola Sara! Soy el equipo de Barbería Styles. ¿Cómo fue tu visita hoy? 😊</Bubble>
            <Bubble side="right" bg="brand">¡Genial! Muy contenta con el corte, quedó perfecto 🥰</Bubble>
            <Bubble side="left"  bg="white" borderAmber>¡Nos alegra mucho, Sara! 🌟 Si dejas una reseña de 5★ en Google Maps y nos envías una captura, te regalamos un <strong>20% de descuento</strong> en tu próxima visita. 👉 maps.google.com/...</Bubble>
            <Bubble side="right" bg="brand">📸 ¡Aquí la captura!</Bubble>
            <Bubble side="left"  bg="white" borderAmber>✅ <strong>¡Captura verificada!</strong> Tu 20% de descuento está reservado. ¡Hasta pronto, Sara! 🎉</Bubble>
            <p className="text-xs text-amber-600 font-medium text-center pt-1">La IA verifica automáticamente las 5★</p>
          </div>
        )}
      </div>

      {/* ── Desktop: original 2+full layout ────────────────────────────────── */}
      <div className="hidden md:block">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-green-600 mb-3 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} />
              Cliente satisfecho → reseña en Google Maps
            </p>
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
              <Bubble side="left"  bg="white" border>¡Hola María! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊</Bubble>
              <Bubble side="right" bg="brand">¡Muy buena! El café estaba riquísimo y el personal súper amable 😍</Bubble>
              <Bubble side="left"  bg="white" border>¡Qué alegría saber eso, María! 🙌 ¿Te animarías a dejar tu opinión en Google Maps? 👉 maps.google.com/...</Bubble>
            </div>
          </div>

          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-red-500 mb-3 uppercase tracking-wide">
              <Shield className="w-4 h-4 shrink-0" strokeWidth={2} />
              Cliente insatisfecho → respuesta empática, sin enlace
            </p>
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
              <Bubble side="left"  bg="white" border>¡Hola Carlos! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia hoy? 😊</Bubble>
              <Bubble side="right" bg="brand">La verdad no muy bien, tardaron mucho y el pedido llegó frío...</Bubble>
              <Bubble side="left"  bg="white" border>Gracias por tu honestidad, Carlos. Lamentamos que tu experiencia no haya sido la esperada 😔 Tu opinión es muy valiosa para mejorar. ¡Esperamos poder verte pronto! 🙏</Bubble>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-600 mb-3 uppercase tracking-wide">
            <Star className="w-4 h-4 shrink-0 fill-amber-400 text-amber-400" strokeWidth={2} />
            Incentivo activo → reseña 5★ verificada y recompensa enviada
          </p>
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
            <div className="grid md:grid-cols-2 gap-x-10">
              <div className="space-y-3">
                <Bubble side="left"  bg="white" borderAmber>¡Hola Sara! Soy el equipo de Barbería Styles. ¿Cómo fue tu visita hoy? 😊</Bubble>
                <Bubble side="right" bg="brand">¡Genial! Muy contenta con el corte, quedó perfecto 🥰</Bubble>
                <Bubble side="left"  bg="white" borderAmber>¡Nos alegra mucho, Sara! 🌟 Si dejas una reseña de 5★ en Google Maps y nos envías una captura, te regalamos un <strong>20% de descuento</strong> en tu próxima visita. 👉 maps.google.com/...</Bubble>
              </div>
              <div className="space-y-3">
                <Bubble side="right" bg="brand">📸 ¡Aquí la captura!</Bubble>
                <Bubble side="left"  bg="white" borderAmber>✅ <strong>¡Captura verificada!</strong> Tu 20% de descuento está reservado. Muéstranos este mensaje en tu próxima visita. ¡Hasta pronto, Sara! 🎉</Bubble>
              </div>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-4 text-center">
              La IA verifica automáticamente que la reseña sea de 5★ antes de enviar la recompensa
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Pequeño helper para los globos de chat
// ---------------------------------------------------------------------------

function Bubble({
  side, bg, border, borderAmber, children,
}: {
  side: "left" | "right";
  bg: "white" | "brand";
  border?: boolean;
  borderAmber?: boolean;
  children: React.ReactNode;
}) {
  if (side === "right") {
    return (
      <div className="flex justify-end">
        <div className="bg-brand-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-xs text-sm">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className={`rounded-2xl rounded-tl-none px-4 py-3 max-w-xs text-sm shadow-sm ${
        bg === "white"
          ? borderAmber
            ? "bg-white border border-amber-100"
            : border
            ? "bg-white border border-gray-100"
            : "bg-white"
          : "bg-white"
      }`}>
        {children}
      </div>
    </div>
  );
}
