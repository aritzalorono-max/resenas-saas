"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, CheckCircle2, Loader2, Check, Building2, Star, MessageCircle } from "lucide-react";

const PLATFORMS = [
  {
    name: "Google Maps",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    ),
    placeholder: "https://g.page/r/Cxxxxxxxx/review",
    hint: 'Google Maps → tu negocio → "Reseñas" → "Obtener más reseñas" → copia el enlace',
  },
  {
    name: "Trustpilot",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
      </svg>
    ),
    placeholder: "https://www.trustpilot.com/evaluate/tu-negocio.com",
    hint: "Inicia sesión en Trustpilot → copia el enlace de tu página de reseñas",
  },
  {
    name: "TripAdvisor",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 3C7.03 3 2.88 6.54 2.04 11.25L2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
      </svg>
    ),
    placeholder: "https://www.tripadvisor.es/...",
    hint: "Copia la URL de tu establecimiento en TripAdvisor",
  },
  {
    name: "App Store",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    placeholder: "https://apps.apple.com/app/idXXXXXXXXXX",
    hint: "Copia el enlace directo a tu app en App Store",
  },
  {
    name: "Otra",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    placeholder: "https://...",
    hint: "Copia el enlace donde quieres que los clientes dejen su reseña",
  },
] as const;

type Platform = (typeof PLATFORMS)[number];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
        <span className="text-[11px] font-extrabold text-white tracking-tight leading-none select-none">RY</span>
      </div>
      <span className="text-base font-bold text-gray-900 tracking-tight">ReseñasYa</span>
    </div>
  );
}

function StepBar({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Tu negocio" },
    { n: 2, label: "Reseñas" },
    { n: 3, label: "¡Listo!" },
  ];
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map(({ n, label }, i) => {
        const done   = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${done   ? "bg-gray-900 text-white"
                  : active ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                  :          "bg-gray-100 text-gray-400"}`}
              >
                {done ? <Check className="w-4 h-4" strokeWidth={2.5} /> : n}
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap
                ${active ? "text-gray-800" : done ? "text-gray-500" : "text-gray-300"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-px mb-5 mx-2 transition-all duration-500 ${done ? "bg-gray-900" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking]         = useState(true);
  const [step, setStep]                 = useState<1 | 2 | 3>(1);
  const [userId, setUserId]             = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [platform, setPlatform]         = useState<Platform>(PLATFORMS[0]);
  const [reviewUrl, setReviewUrl]       = useState("");
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState("");

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);

      const { data: biz } = await supabase
        .from("businesses")
        .select("name")
        .eq("user_id", user.id)
        .single();

      if (biz?.name) { router.replace("/dashboard"); return; }
      setChecking(false);
    }
    init();
  }, [router]);

  async function saveAndFinish(withUrl: boolean) {
    if (!userId) return;
    setSaving(true);
    setError("");
    try {
      const supabase = createClient();
      const url      = withUrl ? reviewUrl.trim() : null;
      const { error: dbError } = await supabase
        .from("businesses")
        .upsert(
          { user_id: userId, name: businessName.trim(), google_maps_url: url },
          { onConflict: "user_id" }
        );
      if (dbError) {
        setError("No se pudo guardar. Inténtalo de nuevo.");
        return;
      }
      setStep(3);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex items-center justify-center pt-8 pb-2 px-4">
        <Logo />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-6">
        <div className="w-full max-w-sm">
          <StepBar current={step} />

          {/* ── Paso 1: Nombre ── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center mb-5">
                <Building2 className="w-5 h-5 text-gray-700" strokeWidth={1.75} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                ¿Cómo se llama tu negocio?
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Aparecerá en los mensajes que reciban tus clientes.
              </p>

              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && businessName.trim()) setStep(2); }}
                placeholder="Ej: Cafetería El Sol, Clínica Dental Ruiz…"
                autoFocus
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm mb-4 bg-gray-50"
              />

              <button
                onClick={() => setStep(2)}
                disabled={!businessName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Paso 2: Enlace ── */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center mb-5">
                <Star className="w-5 h-5 text-gray-700" strokeWidth={1.75} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                ¿Dónde quieres las reseñas?
              </h1>
              <p className="text-sm text-gray-500 mb-5">
                Los clientes satisfechos irán aquí a dejar su opinión.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => { setPlatform(p); setReviewUrl(""); setError(""); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                      ${platform.name === p.name
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
                      }`}
                  >
                    {p.icon} {p.name}
                  </button>
                ))}
              </div>

              <input
                type="url"
                value={reviewUrl}
                onChange={(e) => { setReviewUrl(e.target.value); setError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter" && reviewUrl.trim()) saveAndFinish(true); }}
                placeholder={platform.placeholder}
                autoFocus
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm mb-1.5 bg-gray-50"
              />
              <p className="text-xs text-gray-400 mb-5 leading-relaxed">{platform.hint}</p>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-3 py-2.5 mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => saveAndFinish(true)}
                  disabled={!reviewUrl.trim() || saving}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm"
                >
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando…</>
                    : <><ArrowRight className="w-4 h-4" /> Continuar</>
                  }
                </button>
                <button
                  type="button"
                  onClick={() => saveAndFinish(false)}
                  disabled={saving}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition disabled:opacity-40"
                >
                  Añadir el enlace más tarde →
                </button>
              </div>
            </div>
          )}

          {/* ── Paso 3: ¡Listo! ── */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-green-600" strokeWidth={1.75} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1.5">
                ¡Todo listo!
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Ya puedes enviar tu primer WhatsApp a un cliente. La IA analizará
                la respuesta y redirigirá a los satisfechos a dejar una reseña
                {reviewUrl ? ` en ${platform.name}` : ""}.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-3">
                {[
                  "Introduces el nombre y teléfono de un cliente",
                  "El cliente recibe un WhatsApp preguntando por su experiencia",
                  "La IA redirige a los satisfechos a dejar reseña",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-sm text-gray-600">{text}</span>
                  </div>
                ))}
              </div>

              {!reviewUrl && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 text-left">
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>Recuerda añadir el enlace de reseñas</strong> en Ajustes para que los
                    clientes satisfechos puedan dejar su valoración.
                  </p>
                </div>
              )}

              <div className="space-y-2.5">
                <Link
                  href="/clientes"
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar primer WhatsApp
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-xs text-gray-400 hover:text-gray-600 py-2 transition"
                >
                  Ver el panel →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
