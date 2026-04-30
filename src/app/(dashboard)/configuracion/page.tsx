"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_WELCOME_MESSAGE } from "@/lib/constants";
import type { Business, BusinessTone, ReviewPlatformLink } from "@/types";

const DEFAULT_WELCOME = DEFAULT_WELCOME_MESSAGE;

const TONE_OPTIONS: { value: BusinessTone; label: string; sublabel: string; example: string }[] = [
  {
    value: "tuteo",
    label: "Trato de tú",
    sublabel: "Cercano y amigable",
    example: "¿Te animarías a dejarnos una reseña...?",
  },
  {
    value: "usted",
    label: "Trato de usted",
    sublabel: "Formal y profesional",
    example: "¿Se animaría a dejarnos una reseña...?",
  },
  {
    value: "juvenil",
    label: "Muy informal",
    sublabel: "Desenfadado y cercano",
    example: "¿Nos echas una mano dejando una reseña...?",
  },
];

const PLATFORMS: { name: string; placeholder: string }[] = [
  { name: "Google Maps",  placeholder: "https://g.page/tu-negocio/review" },
  { name: "Trustpilot",  placeholder: "https://www.trustpilot.com/review/tu-negocio.com" },
  { name: "App Store",   placeholder: "https://apps.apple.com/app/idXXXXXXXXXX" },
  { name: "Play Store",  placeholder: "https://play.google.com/store/apps/details?id=com.tu.app" },
  { name: "TripAdvisor", placeholder: "https://www.tripadvisor.es/..." },
  { name: "Booking.com", placeholder: "https://www.booking.com/hotel/..." },
  { name: "Yelp",        placeholder: "https://www.yelp.com/biz/tu-negocio" },
  { name: "Facebook",    placeholder: "https://www.facebook.com/tu-negocio/reviews" },
  { name: "Otra",        placeholder: "https://..." },
];

// ---------------------------------------------------------------------------
// Helpers para el acortador de URLs
// ---------------------------------------------------------------------------

function generateShortCode(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function ensureShortCodes(
  supabase: ReturnType<typeof createClient>,
  links: ReviewPlatformLink[],
  businessId: string
): Promise<ReviewPlatformLink[]> {
  const result: ReviewPlatformLink[] = [];
  for (const link of links) {
    if (link.shortCode) {
      await supabase.from("short_links").upsert({ code: link.shortCode, url: link.url, business_id: businessId });
      result.push(link);
    } else {
      let shortCode = "";
      for (let i = 0; i < 10 && !shortCode; i++) {
        const code = generateShortCode();
        const { error } = await supabase.from("short_links").insert({ code, url: link.url, business_id: businessId });
        if (!error) shortCode = code;
      }
      result.push({ ...link, shortCode: shortCode || undefined });
    }
  }
  return result;
}

export default function ConfiguracionPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website_url: "",
    // Plataforma activa
    activePlatformName: "Google Maps",
    activeShortCode: undefined as string | undefined,
    google_maps_url: "",
    // Plataformas adicionales
    otherPlatforms: [] as ReviewPlatformLink[],
    // Mensaje y tono
    welcome_message: "",
    tone: "tuteo" as BusinessTone,
    // Incentivo
    incentive_enabled: false,
    incentive_description: "",
  });
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");
  const [generatingMsg, setGeneratingMsg] = useState(false);
  const [toneExpanded, setToneExpanded]       = useState(false);
  const [addingPlatform, setAddingPlatform]   = useState(false);
  const [newPlatformName, setNewPlatformName] = useState("Google Maps");
  const [newPlatformUrl, setNewPlatformUrl]   = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setBusiness(data);
        const links: ReviewPlatformLink[] = data.review_links ?? [];
        const active = links.find((l) => l.url === data.google_maps_url);
        const others = links.filter((l) => l.url !== data.google_maps_url);
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          website_url: data.website_url ?? "",
          activePlatformName: active?.name ?? "Google Maps",
          activeShortCode: active?.shortCode,
          google_maps_url: data.google_maps_url ?? "",
          otherPlatforms: others,
          welcome_message: data.welcome_message ?? DEFAULT_WELCOME,
          tone: data.tone ?? "tuteo",
          incentive_enabled: data.incentive_enabled ?? false,
          incentive_description: data.incentive_description ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleGenerateMessage() {
    setGeneratingMsg(true);
    try {
      const res = await fetch("/api/generate-welcome-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          website_url: form.website_url,
          tone: form.tone,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setForm((p) => ({ ...p, welcome_message: data.message }));
      }
    } catch {
      // silencioso — el usuario puede seguir editando manualmente
    } finally {
      setGeneratingMsg(false);
    }
  }

  function handleActivatePlatform(link: ReviewPlatformLink) {
    setForm((p) => ({
      ...p,
      otherPlatforms: [
        ...(p.google_maps_url ? [{ name: p.activePlatformName, url: p.google_maps_url, shortCode: p.activeShortCode }] : []),
        ...p.otherPlatforms.filter((o) => o.url !== link.url),
      ],
      activePlatformName: link.name,
      activeShortCode: link.shortCode,
      google_maps_url: link.url,
    }));
  }

  function handleRemovePlatform(url: string) {
    setForm((p) => ({ ...p, otherPlatforms: p.otherPlatforms.filter((o) => o.url !== url) }));
  }

  function handleAddPlatform() {
    const url = newPlatformUrl.trim();
    if (!url) return;
    setForm((p) => ({
      ...p,
      otherPlatforms: [...p.otherPlatforms, { name: newPlatformName, url }],
      // If no active URL yet, set this as active
      activePlatformName: p.google_maps_url ? p.activePlatformName : newPlatformName,
      google_maps_url: p.google_maps_url || url,
    }));
    setAddingPlatform(false);
    setNewPlatformUrl("");
    setNewPlatformName("Google Maps");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    const rawLinks: ReviewPlatformLink[] = [
      ...(form.google_maps_url
        ? [{ name: form.activePlatformName, url: form.google_maps_url, shortCode: form.activeShortCode }]
        : []),
      ...form.otherPlatforms,
    ];

    try {
      const supabase = createClient();

      // Generar o actualizar códigos cortos — si falla, se continúa sin ellos
      let allLinks = rawLinks;
      try {
        allLinks = await ensureShortCodes(supabase, rawLinks, business!.id);
      } catch (shortCodeErr) {
        console.error("[ReseñasYa] ensureShortCodes falló, guardando sin código corto:", shortCodeErr);
      }

      const { error: updateError } = await supabase
        .from("businesses")
        .update({
          name: form.name.trim(),
          description: form.description.trim() || null,
          website_url: form.website_url.trim() || null,
          google_maps_url: form.google_maps_url || null,
          review_links: allLinks,
          welcome_message: form.welcome_message.trim() || DEFAULT_WELCOME,
          tone: form.tone,
          incentive_enabled: form.incentive_enabled,
          incentive_description: form.incentive_description.trim() || null,
        })
        .eq("id", business!.id);

      if (updateError) {
        console.error("[ReseñasYa] Error al actualizar negocio:", updateError);
        setError(`Error al guardar los cambios: ${updateError.message}`);
        return;
      }

      // Actualizar el estado local con los nuevos shortCodes
      const savedActive = allLinks.find((l) => l.url === form.google_maps_url);
      setForm((p) => ({
        ...p,
        activeShortCode: savedActive?.shortCode,
        otherPlatforms: allLinks.filter((l) => l.url !== p.google_maps_url),
      }));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("[ReseñasYa] Error inesperado al guardar:", err);
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Cargando...</div>;
  }

  const currentTone = TONE_OPTIONS.find((o) => o.value === form.tone)!;
  const activePlaceholder = PLATFORMS.find((p) => p.name === form.activePlatformName)?.placeholder ?? "https://...";
  const newPlaceholder    = PLATFORMS.find((p) => p.name === newPlatformName)?.placeholder ?? "https://...";

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Personaliza la información de tu negocio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Datos del negocio ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Datos del negocio</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre del negocio *
            </label>
            <input
              id="name" name="name" type="text" value={form.name} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder="Ej: Cafetería El Sol"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Descripción breve
            </label>
            <textarea
              id="description" name="description" value={form.description} onChange={handleChange}
              rows={2} maxLength={200}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Ej: Cafetería familiar en el centro, especializada en desayunos y brunch"
            />
            <p className="text-xs text-gray-400 mt-1">{form.description.length}/200</p>
          </div>

          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1.5">
              Página web
            </label>
            <input
              id="website_url" name="website_url" type="url" value={form.website_url} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder="https://www.tu-negocio.com"
            />
          </div>
        </div>

        {/* ── Plataforma de reseñas ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Plataforma de reseñas</h2>

          {/* Plataforma activa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Enlace activo <span className="text-gray-400 font-normal">(el que recibirán tus clientes)</span>
            </label>
            <div className="flex flex-col xs:flex-row gap-2">
              <select
                value={form.activePlatformName}
                onChange={(e) => setForm((p) => ({ ...p, activePlatformName: e.target.value }))}
                className="xs:shrink-0 xs:w-36 w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
              <input
                name="google_maps_url" type="url" value={form.google_maps_url} onChange={handleChange}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
                placeholder={activePlaceholder}
              />
            </div>
            {form.google_maps_url ? (
              <div className="mt-2 space-y-1">
                {form.activeShortCode ? (
                  <p className="text-xs text-gray-700">
                    <span className="text-gray-400">Enlace en WhatsApp: </span>
                    <span className="font-semibold text-brand-600">
                      {typeof window !== "undefined" ? window.location.origin : ""}/r/{form.activeShortCode}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    El enlace acortado se generará al guardar.
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Destino:{" "}
                  <a href={form.google_maps_url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                    {form.google_maps_url}
                  </a>
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-2">
                Introduce el enlace para que tus clientes puedan dejar su reseña.
              </p>
            )}
          </div>

          {/* Plataformas adicionales */}
          {form.otherPlatforms.length > 0 && (
            <div className="space-y-1.5">
              {form.otherPlatforms.map((link) => (
                <div key={link.url} className="flex items-center gap-3 py-1.5 px-1">
                  <span className="text-sm font-medium text-gray-600 w-28 shrink-0">{link.name}</span>
                  <span className="flex-1 text-xs text-gray-400 truncate">{link.url}</span>
                  <button
                    type="button"
                    onClick={() => handleActivatePlatform(link)}
                    className="text-xs text-brand-600 font-semibold hover:text-brand-800 shrink-0"
                  >
                    Activar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePlatform(link.url)}
                    className="text-xs text-gray-400 hover:text-red-500 shrink-0"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Añadir otra plataforma */}
          {addingPlatform ? (
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex gap-2">
                <select
                  value={newPlatformName}
                  onChange={(e) => setNewPlatformName(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => { setAddingPlatform(false); setNewPlatformUrl(""); }}
                  className="shrink-0 text-gray-400 hover:text-gray-600 p-2.5 rounded-lg hover:bg-gray-100 transition"
                  aria-label="Cancelar"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="url" value={newPlatformUrl}
                  onChange={(e) => setNewPlatformUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  placeholder={newPlaceholder}
                  autoFocus
                />
                <button
                  type="button" onClick={handleAddPlatform} disabled={!newPlatformUrl.trim()}
                  className="shrink-0 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
                >
                  Añadir
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button" onClick={() => setAddingPlatform(true)}
              className="text-sm text-brand-600 hover:text-brand-800 font-medium"
            >
              + Añadir otra plataforma
            </button>
          )}
        </div>

        {/* ── Tono de comunicación ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">Tono de comunicación</h2>
              {!toneExpanded && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {currentTone.label} — {currentTone.sublabel}
                </p>
              )}
            </div>
            {!toneExpanded && (
              <button
                type="button"
                onClick={() => setToneExpanded(true)}
                className="shrink-0 text-sm text-brand-600 font-medium hover:text-brand-800 mt-0.5"
              >
                Cambiar
              </button>
            )}
          </div>

          {toneExpanded && (
            <div className="grid gap-2.5">
              {TONE_OPTIONS.map((opt) => {
                const selected = form.tone === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setForm((p) => ({ ...p, tone: opt.value })); setToneExpanded(false); }}
                    className={`w-full text-left rounded-xl border-2 px-4 py-3 transition ${
                      selected ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold text-sm ${selected ? "text-brand-700" : "text-gray-800"}`}>
                          {opt.label}
                          <span className={`ml-2 font-normal text-xs ${selected ? "text-brand-500" : "text-gray-400"}`}>
                            {opt.sublabel}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1 italic">&ldquo;{opt.example}&rdquo;</p>
                      </div>
                      <span className={`shrink-0 w-4 h-4 rounded-full border-2 ml-3 ${selected ? "border-brand-500 bg-brand-500" : "border-gray-300"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Mensaje inicial de WhatsApp ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">Mensaje inicial de WhatsApp</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Usa <code className="bg-gray-100 px-1 rounded">{"{nombre}"}</code> y{" "}
                <code className="bg-gray-100 px-1 rounded">{"{negocio}"}</code> como variables
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateMessage}
              disabled={generatingMsg || !form.name}
              className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title={!form.name ? "Introduce primero el nombre del negocio" : "Generar mensaje con IA"}
            >
              {generatingMsg ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Generando...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
                  </svg>
                  Generar con IA
                </>
              )}
            </button>
          </div>

          <textarea
            id="welcome_message" name="welcome_message" value={form.welcome_message}
            onChange={handleChange} rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Escribe el mensaje o usa el botón ✨ para generarlo con IA"
          />

          {form.welcome_message && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2">Vista previa:</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {form.welcome_message
                  .replace("{nombre}", "María")
                  .replace("{negocio}", form.name || "tu negocio")}
              </p>
            </div>
          )}
        </div>

        {/* ── Incentivo 5★ ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">Incentivo por reseña 5 estrellas</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Ofrece un regalo o descuento a los clientes que dejen la máxima puntuación
            </p>
          </div>

          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, incentive_enabled: !p.incentive_enabled }))}
            className={`flex items-center gap-3 w-full text-left rounded-xl border-2 p-4 transition ${
              form.incentive_enabled ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${form.incentive_enabled ? "bg-brand-500" : "bg-gray-300"}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.incentive_enabled ? "translate-x-5" : "translate-x-1"}`} />
            </span>
            <div>
              <p className={`font-semibold text-sm ${form.incentive_enabled ? "text-brand-700" : "text-gray-700"}`}>
                {form.incentive_enabled ? "Incentivo activado" : "Incentivo desactivado"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {form.incentive_enabled
                  ? "Los clientes satisfechos recibirán la oferta automáticamente"
                  : "Actívalo para fomentar reseñas de máxima puntuación"}
              </p>
            </div>
          </button>

          {form.incentive_enabled && (
            <div>
              <label htmlFor="incentive_description" className="block text-sm font-medium text-gray-700 mb-1.5">
                ¿Qué ofreces a cambio? *
              </label>
              <input
                id="incentive_description" name="incentive_description" type="text"
                value={form.incentive_description} onChange={handleChange}
                maxLength={200} required={form.incentive_enabled}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
                placeholder="Ej: 25% de descuento en tu próxima visita con el código GRACIAS25"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Este texto aparecerá en el mensaje que recibe el cliente.
              </p>
            </div>
          )}

          {!form.google_maps_url && form.incentive_enabled && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              Necesitas añadir el enlace de una plataforma de reseñas para que el incentivo funcione.
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">
            ✅ Cambios guardados correctamente
          </div>
        )}

        <button
          type="submit" disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      {/* ── Webhook info ── */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="font-semibold text-blue-900 mb-3">Configurar Twilio webhook</h3>
        <p className="text-sm text-blue-800 mb-2">
          Para recibir las respuestas de los clientes, configura este webhook en tu cuenta de Twilio:
        </p>
        <code className="block bg-blue-100 text-blue-900 text-sm px-3 py-2 rounded-lg font-mono break-all">
          {typeof window !== "undefined" ? window.location.origin : "https://tu-dominio.com"}/api/twilio-webhook
        </code>
        <p className="text-xs text-blue-700 mt-2">
          Twilio Console → Messaging → Sandbox for WhatsApp → When a message comes in
        </p>
      </div>
    </div>
  );
}
