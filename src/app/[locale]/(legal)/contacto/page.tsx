"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const EMAIL_SOPORTE = "contacto.resenasya@gmail.com";

export default function ContactoPage() {
  const t = useTranslations("contact");

  const TOPICS = [
    { value: "soporte",   label: t("topicSupport") },
    { value: "ventas",    label: t("topicSales") },
    { value: "legal",     label: t("topicLegal") },
    { value: "feedback",  label: t("topicFeedback") },
    { value: "otro",      label: t("topicOther") },
  ];

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
      const topicLabel = TOPICS.find(tp => tp.value === form.asunto)?.label ?? form.asunto;
      const subject = encodeURIComponent(`[${topicLabel}] ${form.nombre}`);
      const body    = encodeURIComponent(
        `${t("nameLabel")}: ${form.nombre}\n${t("emailLabel")}: ${form.email}\n${t("subjectLabel")}: ${topicLabel}\n\n${form.mensaje}`
      );
      window.location.href = `mailto:${EMAIL_SOPORTE}?subject=${subject}&body=${body}`;
      setSent(true);
    } catch {
      setError(`${t("errorMailClient")} ${EMAIL_SOPORTE}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <header className="mb-10 pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">{t("eyebrow")}</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t("title")}</h1>
        <p className="text-gray-400 text-sm">{t("subtitle")}</p>
      </header>

      <div className="grid lg:grid-cols-5 gap-10">

        {/* ── Form ──────────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          {sent ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("successTitle")}</h2>
              <p className="text-sm text-gray-500 mb-5">
                {t("successDesc")}{" "}
                <a href={`mailto:${EMAIL_SOPORTE}`} className="text-brand-600 font-medium hover:underline">
                  {EMAIL_SOPORTE}
                </a>.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ nombre: "", email: "", asunto: "soporte", mensaje: "" }); }}
                className="text-sm text-brand-600 font-semibold hover:underline"
              >
                {t("sendAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t("nameLabel")} *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
                    placeholder={t("namePlaceholder")}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t("emailLabel")} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
                    placeholder={t("emailPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t("subjectLabel")} *
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  value={form.asunto}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm bg-white"
                >
                  {TOPICS.map((tp) => (
                    <option key={tp.value} value={tp.value}>{tp.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t("messageLabel")} *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={6}
                  value={form.mensaje}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none text-sm"
                  placeholder={t("messagePlaceholder")}
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
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    {t("send")}
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center">{t("footerNote")}</p>
            </form>
          )}
        </div>

        {/* ── Contact info ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 text-sm">{t("directContactTitle")}</h2>
            <div className="space-y-4">
              <ContactItem
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                }
                label={t("generalSupport")}
                value={EMAIL_SOPORTE}
                href={`mailto:${EMAIL_SOPORTE}`}
              />
            </div>
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-brand-800 text-sm">{t("responseTimeTitle")}</p>
                <p className="text-xs text-brand-700 mt-0.5 leading-relaxed">
                  {t("responseTimeDesc")} <strong>{t("responseTimeHighlight")}</strong>{" "}
                  {t("responseTimeSuffix")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-3 text-sm">{t("beforeWritingTitle")}</h2>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">{t("beforeWritingDesc")}</p>
            <a
              href="/#faq"
              className="inline-flex items-center gap-1.5 text-sm text-brand-600 font-semibold hover:underline"
            >
              {t("viewFaq")}
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
