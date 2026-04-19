"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Business } from "@/types";

const DEFAULT_WELCOME =
  "¡Hola {nombre}! Soy el equipo de {negocio}. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊";

export default function ConfiguracionPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState({
    name: "",
    google_maps_url: "",
    welcome_message: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
          google_maps_url: data.google_maps_url ?? "",
          welcome_message: data.welcome_message ?? DEFAULT_WELCOME,
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("businesses")
      .update({
        name: form.name.trim(),
        google_maps_url: form.google_maps_url.trim() || null,
        welcome_message: form.welcome_message.trim() || DEFAULT_WELCOME,
      })
      .eq("id", business!.id);

    setSaving(false);

    if (updateError) {
      setError("Error al guardar los cambios");
      return;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Cargando...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Personaliza la información de tu negocio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Datos del negocio</h2>

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
            <label htmlFor="google_maps_url" className="block text-sm font-medium text-gray-700 mb-1.5">
              Enlace de Google Maps
            </label>
            <input
              id="google_maps_url"
              name="google_maps_url"
              type="url"
              value={form.google_maps_url}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder="https://maps.google.com/..."
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Ve a Google Maps, busca tu negocio, haz clic en &ldquo;Compartir&rdquo; y copia el enlace
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">Mensaje de WhatsApp</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Usa <code className="bg-gray-100 px-1 rounded">{"{nombre}"}</code> y{" "}
              <code className="bg-gray-100 px-1 rounded">{"{negocio}"}</code> como variables
            </p>
          </div>

          <div>
            <label htmlFor="welcome_message" className="block text-sm font-medium text-gray-700 mb-1.5">
              Mensaje inicial al cliente
            </label>
            <textarea
              id="welcome_message"
              name="welcome_message"
              value={form.welcome_message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

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

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
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

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="font-semibold text-blue-900 mb-3">Configurar Twilio webhook</h3>
        <p className="text-sm text-blue-800 mb-2">
          Para recibir las respuestas de los clientes, configura este webhook en tu cuenta de Twilio:
        </p>
        <code className="block bg-blue-100 text-blue-900 text-sm px-3 py-2 rounded-lg font-mono break-all">
          {typeof window !== "undefined" ? window.location.origin : "https://tu-dominio.com"}/api/twilio-webhook
        </code>
        <p className="text-xs text-blue-700 mt-2">
          En Twilio Console → Messaging → Sandbox for WhatsApp → When a message comes in
        </p>
      </div>
    </div>
  );
}
