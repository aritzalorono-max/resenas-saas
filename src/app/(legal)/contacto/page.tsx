"use client";

import { useState } from "react";

const EMAIL_SOPORTE = "hola@resenasya.com";
const EMAIL_LEGAL   = "legal@resenasya.com";
const TWITTER_URL   = "https://twitter.com/resenasya";
const LINKEDIN_URL  = "https://linkedin.com/company/resenasya";
const INSTAGRAM_URL = "https://instagram.com/resenasya";

const TOPICS = [
  { value: "soporte",   label: "Soporte técnico" },
  { value: "ventas",    label: "Planes y precios" },
  { value: "legal",     label: "Consulta legal / privacidad" },
  { value: "feedback",  label: "Feedback o sugerencia" },
  { value: "otro",      label: "Otro" },
];

export default function ContactoPage() {
  const [form, setForm]       = useState({ nombre: "", email: "", asunto: "soporte", mensaje: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);

    try {
      // Abre el cliente de correo del usuario con los datos rellenados
      const subject = encodeURIComponent(`[${TOPICS.find(t => t.value === form.asunto)?.label}] ${form.nombre}`);
      const body    = encodeURIComponent(
        `Nombre: ${form.nombre}\nEmail: ${form.email}\nAsunto: ${TOPICS.find(t => t.value === form.asunto)?.label}\n\n${form.mensaje}`
      );
      const dest = form.asunto === "legal" ? EMAIL_LEGAL : EMAIL_SOPORTE;
      window.location.href = `mailto:${dest}?subject=${subject}&body=${body}`;
      setSent(true);
    } catch {
      setError("No se pudo abrir el cliente de correo. Por favor, escríbenos directamente a " + EMAIL_SOPORTE);
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <header className="mb-10 pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">Hablemos</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Contacto</h1>
        <p className="text-gray-400 text-sm">
          ¿Tienes alguna pregunta, duda o sugerencia? Escríbenos y te respondemos en menos de 24 horas.
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-10">

        {/* ── Formulario ──────────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          {sent ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">¡Mensaje preparado!</h2>
              <p className="text-sm text-gray-500 mb-5">
                Se ha abierto tu cliente de correo con el mensaje listo para enviar.
                Si no se abrió, puedes escribirnos directamente a{" "}
                <a href={`mailto:${EMAIL_SOPORTE}`} className="text-brand-600 font-medium hover:underline">
                  {EMAIL_SOPORTE}
                </a>.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ nombre: "", email: "", asunto: "soporte", mensaje: "" }); }}
                className="text-sm text-brand-600 font-semibold hover:underline"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tu nombre *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
                    placeholder="María García"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tu email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
                    placeholder="maria@minegocio.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Asunto *
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  value={form.asunto}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm bg-white"
                >
                  {TOPICS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {form.asunto === "legal" && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Las consultas legales se enviarán a{" "}
                    <a href={`mailto:${EMAIL_LEGAL}`} className="text-brand-600">{EMAIL_LEGAL}</a>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={6}
                  value={form.mensaje}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none text-sm"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Preparando mensaje...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Enviar mensaje
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Al enviar este formulario se abrirá tu cliente de correo con el mensaje listo.
              </p>
            </form>
          )}
        </div>

        {/* ── Info de contacto ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Contacto directo */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 text-sm">Contacto directo</h2>
            <div className="space-y-4">
              <ContactItem
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                }
                label="Soporte general"
                value={EMAIL_SOPORTE}
                href={`mailto:${EMAIL_SOPORTE}`}
              />
              <ContactItem
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                }
                label="Legal y privacidad"
                value={EMAIL_LEGAL}
                href={`mailto:${EMAIL_LEGAL}`}
              />
            </div>
          </div>

          {/* Tiempo de respuesta */}
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-brand-800 text-sm">Tiempo de respuesta</p>
                <p className="text-xs text-brand-700 mt-0.5 leading-relaxed">
                  Respondemos a todas las consultas en un plazo máximo de <strong>24 horas en días laborables</strong>{" "}
                  (lunes a viernes, 9:00–18:00 CET).
                </p>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 text-sm">Síguenos</h2>
            <div className="space-y-3">
              <SocialLink
                href={TWITTER_URL}
                label="Twitter / X"
                handle="@resenasya"
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                }
              />
              <SocialLink
                href={LINKEDIN_URL}
                label="LinkedIn"
                handle="ReseñasYa"
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                }
              />
              <SocialLink
                href={INSTAGRAM_URL}
                label="Instagram"
                handle="@resenasya"
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                }
              />
            </div>
          </div>

          {/* FAQ rápida */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-3 text-sm">Antes de escribirnos</h2>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Quizás encuentres la respuesta en nuestra sección de preguntas frecuentes:
            </p>
            <a
              href="/#faq"
              className="inline-flex items-center gap-1.5 text-sm text-brand-600 font-semibold hover:underline"
            >
              Ver preguntas frecuentes →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({
  icon, label, value, href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a href={href} className="flex items-center gap-3 group">
      <div className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0 text-gray-500 group-hover:border-brand-300 group-hover:text-brand-600 transition">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700 group-hover:text-brand-600 transition">{value}</p>
      </div>
    </a>
  );
}

function SocialLink({
  href, label, handle, icon,
}: {
  href: string;
  label: string;
  handle: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 group"
    >
      <div className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0 text-gray-500 group-hover:border-brand-300 group-hover:text-brand-600 transition">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700 group-hover:text-brand-600 transition">{handle}</p>
      </div>
    </a>
  );
}
