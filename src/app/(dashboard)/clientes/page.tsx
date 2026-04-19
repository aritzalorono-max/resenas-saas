"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientesPage() {
  const router = useRouter();
  const [form, setForm] = useState({ customer_name: "", customer_phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/send-review-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al enviar la solicitud");
        return;
      }

      setSuccess(true);
      setForm({ customer_name: "", customer_phone: "" });
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Enviar solicitud de reseña</h1>
        <p className="text-gray-500 mt-1">
          Introduce los datos del cliente para enviarle un WhatsApp pidiendo su opinión
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡WhatsApp enviado!</h2>
            <p className="text-gray-500 mb-6">
              El cliente recibirá el mensaje en su WhatsApp en breve.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSuccess(false)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
              >
                Enviar otro
              </button>
              <button
                onClick={() => router.push("/resenas")}
                className="border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                Ver reseñas
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre del cliente
              </label>
              <input
                id="customer_name"
                name="customer_name"
                type="text"
                value={form.customer_name}
                onChange={handleChange}
                required
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-lg"
                placeholder="Ej: María García"
              />
            </div>

            <div>
              <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Teléfono (WhatsApp)
              </label>
              <input
                id="customer_phone"
                name="customer_phone"
                type="tel"
                value={form.customer_phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-lg"
                placeholder="Ej: +34 612 345 678"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Incluye el prefijo internacional (ej: +34 para España)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Enviando WhatsApp...
                </>
              ) : (
                <>
                  <span>💬</span>
                  Enviar por WhatsApp
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <h3 className="font-medium text-blue-900 mb-2">¿Cómo funciona?</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Introduces el nombre y teléfono del cliente</li>
          <li>Le llega un WhatsApp pidiendo su opinión</li>
          <li>Si es positiva, la IA le anima a dejar reseña en Google Maps</li>
          <li>Si es negativa, le responde con empatía sin enviarle al enlace</li>
        </ol>
      </div>
    </div>
  );
}
