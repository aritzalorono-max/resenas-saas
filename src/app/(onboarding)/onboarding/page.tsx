"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ChevronRight, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

const PLATFORMS = [
  {
    name: "Google Maps",
    emoji: "🗺️",
    placeholder: "https://g.page/r/Cxxxxxxxx/review",
    hint: 'Busca tu negocio en Google Maps → botón "Reseñas" → "Obtener más reseñas" → copia el enlace',
  },
  {
    name: "Trustpilot",
    emoji: "⭐",
    placeholder: "https://www.trustpilot.com/evaluate/tu-negocio.com",
    hint: "Inicia sesión en Trustpilot y copia el enlace de tu página de reseñas",
  },
  {
    name: "TripAdvisor",
    emoji: "🦉",
    placeholder: "https://www.tripadvisor.es/...",
    hint: "Copia la URL de tu establecimiento en TripAdvisor",
  },
  {
    name: "App Store",
    emoji: "🍎",
    placeholder: "https://apps.apple.com/app/idXXXXXXXXXX",
    hint: "Copia el enlace directo a tu app en App Store",
  },
  {
    name: "Otra",
    emoji: "🔗",
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

function StepDots({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Negocio" },
    { n: 2, label: "Reseñas" },
    { n: 3, label: "¡Listo!" },
  ];
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map(({ n, label }, i) => {
        const done   = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${done   ? "bg-brand-600 text-white"
                  : active ? "bg-brand-600 text-white ring-4 ring-brand-100"
                  :          "bg-gray-200 text-gray-400"}`}
              >
                {done ? "✓" : n}
              </div>
              <span className={`text-[10px] font-medium tracking-wide hidden sm:block
                ${active ? "text-gray-700" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-10 h-0.5 mb-4 mx-1 transition-all duration-300 ${done ? "bg-brand-500" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking]       = useState(true);
  const [step, setStep]               = useState<1 | 2 | 3>(1);
  const [userId, setUserId]           = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [platform, setPlatform]       = useState<Platform>(PLATFORMS[0]);
  const [reviewUrl, setReviewUrl]     = useState("");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  // Auth guard + skip if already configured
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

      if (biz?.name) {
        router.replace("/dashboard");
        return;
      }
      setChecking(false);
    }
    init();
  }, [router]);

  async function saveName() {
    if (!userId || !businessName.trim()) return;
    setStep(2);
  }

  async function saveAndFinish(withUrl: boolean) {
    if (!userId) return;
    setSaving(true);
    setError("");
    try {
      const supabase  = createClient();
      const url       = withUrl ? reviewUrl.trim() : null;
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
        <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center pt-8 pb-4 px-4">
        <Logo />
      </header>

      {/* Wizard */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <StepDots current={step} />

          {/* ── Paso 1: Nombre ─────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🏪</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Cómo se llama tu negocio?
                </h1>
                <p className="text-sm text-gray-500">
                  Este nombre aparecerá en los WhatsApp que reciban tus clientes.
                </p>
              </div>

              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && businessName.trim()) saveName(); }}
                placeholder="Ej: Cafetería El Sol, Clínica Dental Ruiz…"
                autoFocus
                maxLength={100}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-base mb-5"
              />

              <button
                onClick={saveName}
                disabled={!businessName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Paso 2: Enlace de reseñas ──────────────────────────────────── */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">⭐</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Dónde quieres las reseñas?
                </h1>
                <p className="text-sm text-gray-500">
                  Cuando un cliente esté satisfecho, le enviaremos aquí para que deje su opinión.
                </p>
              </div>

              {/* Selector de plataforma */}
              <div className="flex flex-wrap gap-2 mb-4">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => { setPlatform(p); setReviewUrl(""); setError(""); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition
                      ${platform.name === p.name
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                      }`}
                  >
                    <span>{p.emoji}</span> {p.name}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-sm mb-2"
              />
              <p className="text-xs text-gray-400 mb-5 leading-relaxed">{platform.hint}</p>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>
              )}

              <div className="space-y-2.5">
                <button
                  onClick={() => saveAndFinish(true)}
                  disabled={!reviewUrl.trim() || saving}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
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
                  className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition disabled:opacity-40"
                >
                  Añadir el enlace más tarde →
                </button>
              </div>
            </div>
          )}

          {/* ── Paso 3: ¡Listo! ────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-9 h-9 text-green-600" strokeWidth={1.75} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Todo listo, {businessName}!
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Ya puedes enviar tu primer WhatsApp. La IA analizará la respuesta y,
                si el cliente está satisfecho, le invitará automáticamente a dejar una reseña
                {reviewUrl ? ` en ${platform.name}` : ""}.
              </p>

              {/* Cómo funciona */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-3">
                {[
                  "Introduces el nombre y teléfono de un cliente",
                  "El cliente recibe un WhatsApp automático preguntando por su experiencia",
                  "La IA analiza la respuesta y redirige a los satisfechos a dejar reseña",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700">{text}</span>
                  </div>
                ))}
              </div>

              {!reviewUrl && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-left">
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>Recuerda añadir el enlace de reseñas</strong> en Ajustes para que los
                    clientes satisfechos puedan dejar su valoración.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  href="/clientes"
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-xl transition"
                >
                  Enviar primer WhatsApp <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-sm text-gray-400 hover:text-gray-600 py-2 transition"
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
