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
    example: "¡Qué alegría saber eso, María! ¿Te animarías a dejarnos una reseña...?",
  },
  {
    value: "usted",
    label: "Trato de usted",
    sublabel: "Formal y profesional",
    example: "¡Qué alegría saber eso, María! ¿Se animaría a dejarnos una reseña...?",
  },
  {
    value: "juvenil",
    label: "Muy informal",
    sublabel: "Desenfadado y cercano",
    example: "¡Genial, María! 🔥 ¿Nos echas una mano dejando una reseña...?",
  },
];

const PREDEFINED_PLATFORMS: { name: string; placeholder: string }[] = [
  { name: "Google Maps",  placeholder: "https://g.page/tu-negocio/review" },
  { name: "Trustpilot",  placeholder: "https://www.trustpilot.com/review/tu-negocio.com" },
  { name: "TripAdvisor", placeholder: "https://www.tripadvisor.es/Restaurant_Review-..." },
  { name: "Booking.com", placeholder: "https://www.booking.com/hotel/..." },
  { name: "Yelp",        placeholder: "https://www.yelp.com/biz/tu-negocio" },
  { name: "Facebook",    placeholder: "https://www.facebook.com/tu-negocio/reviews" },
];

export default function ConfiguracionPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website_url: "",
    google_maps_url: "",
    review_links: [] as ReviewPlatformLink[],
    welcome_message: "",
    tone: "tuteo" as BusinessTone,
    incentive_enabled: false,
    incentive_description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Add-platform form state
  const [showAddPlatform, setShowAddPlatform] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState("Google Maps");
  const [customPlatformName, setCustomPlatformName] = useState("");
  const [newPlatformUrl, setNewPlatformUrl] = useState("");

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
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          website_url: data.website_url ?? "",
          google_maps_url: data.google_maps_url ?? "",
          review_links: data.review_links ?? [],
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAddPlatform() {
    const name = newPlatformName === "__custom"
      ? customPlatformName.trim()
      : newPlatformName;
    const url = newPlatformUrl.trim();
    if (!name || !url) return;
    if (form.review_links.some((l) => l.url === url)) return;

    const newLinks = [...form.review_links, { name, url }];
    setForm((p) => ({
      ...p,
      review_links: newLinks,
      google_maps_url: p.google_maps_url || url,
    }));
    setShowAddPlatform(false);
    setNewPlatformUrl("");
    setNewPlatformName("Google Maps");
    setCustomPlatformName("");
  }

  function handleRemovePlatform(url: string) {
    const newLinks = form.review_links.filter((l) => l.url !== url);
    setForm((p) => ({
      ...p,
      review_links: newLinks,
      google_maps_url: p.google_maps_url === url
        ? (newLinks[0]?.url ?? "")
        : p.google_maps_url,
    }));
  }

  function handleSetActivePlatform(url: string) {
    setForm((p) => ({ ...p, google_maps_url: url }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("businesses")
        .update({
          name: form.name.trim(),
          description: form.description.trim() || null,
          website_url: form.website_url.trim() || null,
          google_maps_url: form.google_maps_url || null,
          review_links: form.review_links,
          welcome_message: form.welcome_message.trim() || DEFAULT_WELCOME,
          tone: form.tone,
          incentive_enabled: form.incentive_enabled,
          incentive_description: form.incentive_description.trim() || null,
        })
        .eq("id", business!.id);

      if (updateError) {
        setError("Error al guardar los cambios");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Cargando...
      </div>
    );
  }

  const currentPlaceholder =
    PREDEFINED_PLATFORMS.find((p) => p.name === newPlatformName)?.placeholder ?? "https://...";

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Personaliza la información de tu negocio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Datos del negocio ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">Datos del negocio</h2>
            <p className="text-sm text-gray-400 mt-0.5">Información básica de tu establecimiento</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre del negocio *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder="Ej: Cafetería El Sol"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Descripción breve
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              maxLength={200}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Ej: Cafetería familiar en el centro, especializada en desayunos y brunch"
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.description.length}/200 — aparece en tu perfil interno
            </p>
          </div>

          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1.5">
              Página web
            </label>
            <input
              id="website_url"
              name="website_url"
              type="url"
              value={form.website_url}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder="https://www.tu-negocio.com"
            />
          </div>
        </div>

        {/* ── Plataformas de reseñas ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">Plataformas de reseñas</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Añade los enlaces donde quieres recibir reseñas. La plataforma{" "}
              <span className="font-medium text-brand-600">activa</span> es la que se envía a tus clientes.
            </p>
          </div>

          {/* Lista de plataformas */}
          {form.review_links.length > 0 ? (
            <div className="space-y-2">
              {form.review_links.map((link) => {
                const isActive = link.url === form.google_maps_url;
                return (
                  <div
                    key={link.url}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3.5 transition ${
                      isActive
                        ? "border-brand-500 bg-brand-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${isActive ? "text-brand-700" : "text-gray-800"}`}>
                          {link.name}
                        </p>
                        {isActive && (
                          <span className="text-xs font-medium bg-brand-500 text-white px-2 py-0.5 rounded-full">
                            Activa
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => handleSetActivePlatform(link.url)}
                          className="text-xs text-brand-600 font-semibold hover:text-brand-800"
                        >
                          Activar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePlatform(link.url)}
                        className="text-xs text-gray-400 hover:text-red-500 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-3">
              No hay ninguna plataforma configurada todavía.
            </p>
          )}

          {/* Formulario para añadir */}
          {showAddPlatform ? (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Plataforma
                </label>
                <select
                  value={newPlatformName}
                  onChange={(e) => setNewPlatformName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                >
                  {PREDEFINED_PLATFORMS.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                  <option value="__custom">Otra plataforma...</option>
                </select>
                {newPlatformName === "__custom" && (
                  <input
                    type="text"
                    value={customPlatformName}
                    onChange={(e) => setCustomPlatformName(e.target.value)}
                    className="mt-2 w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="Nombre de la plataforma"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  URL de tu perfil en esa plataforma
                </label>
                <input
                  type="url"
                  value={newPlatformUrl}
                  onChange={(e) => setNewPlatformUrl(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  placeholder={newPlatformName === "__custom" ? "https://..." : currentPlaceholder}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddPlatform}
                  disabled={!newPlatformUrl.trim() || (newPlatformName === "__custom" && !customPlatformName.trim())}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  Añadir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlatform(false);
                    setNewPlatformUrl("");
                    setNewPlatformName("Google Maps");
                    setCustomPlatformName("");
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 bg-white transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddPlatform(true)}
              className="w-full border-2 border-dashed border-gray-300 hover:border-brand-400 text-gray-500 hover:text-brand-600 text-sm font-medium py-3 rounded-xl transition"
            >
              + Añadir plataforma
            </button>
          )}
        </div>

        {/* ── Tono de comunicación ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">Tono de comunicación</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Cómo se dirigirá la IA a tus clientes en los mensajes de seguimiento
            </p>
          </div>

          <div className="grid gap-3">
            {TONE_OPTIONS.map((opt) => {
              const selected = form.tone === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, tone: opt.value }))}
                  className={`w-full text-left rounded-xl border-2 p-4 transition ${
                    selected
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-semibold text-sm ${selected ? "text-brand-700" : "text-gray-800"}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.sublabel}</p>
                      <p className="text-xs text-gray-400 mt-2 italic">&ldquo;{opt.example}&rdquo;</p>
                    </div>
                    <span
                      className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selected ? "border-brand-500 bg-brand-500" : "border-gray-300"
                      }`}
                    >
                      {selected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Mensaje de WhatsApp ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">Mensaje inicial de WhatsApp</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Usa <code className="bg-gray-100 px-1 rounded">{"{nombre}"}</code> y{" "}
              <code className="bg-gray-100 px-1 rounded">{"{negocio}"}</code> como variables
            </p>
          </div>

          <textarea
            id="welcome_message"
            name="welcome_message"
            value={form.welcome_message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none"
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
              Ofrece un regalo o descuento a los clientes que dejen la máxima puntuación en tu plataforma activa
            </p>
          </div>

          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, incentive_enabled: !p.incentive_enabled }))}
            className={`flex items-center gap-3 w-full text-left rounded-xl border-2 p-4 transition ${
              form.incentive_enabled
                ? "border-brand-500 bg-brand-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <span
              className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${
                form.incentive_enabled ? "bg-brand-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  form.incentive_enabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
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
                id="incentive_description"
                name="incentive_description"
                type="text"
                value={form.incentive_description}
                onChange={handleChange}
                maxLength={200}
                required={form.incentive_enabled}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
                placeholder="Ej: 25% de descuento en tu próxima visita con el código GRACIAS25"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Este texto aparecerá en el mensaje que recibe el cliente. Sé claro y específico.
              </p>
              {form.incentive_description && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Vista previa del mensaje:</p>
                  <p className="text-xs text-gray-700 italic">
                    &ldquo;...¡te regalamos {form.incentive_description}! Cuando publiques tu reseña de 5 estrellas, mándanos una captura de pantalla...&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {!form.google_maps_url && form.incentive_enabled && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
              Necesitas configurar al menos una plataforma de reseñas y activarla para que el incentivo funcione.
            </div>
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
          type="submit"
          disabled={saving}
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
