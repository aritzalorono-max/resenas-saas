"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const [formData, setFormData] = useState({
    email:           "",
    password:        "",
    confirmPassword: "",
  });
  const [termsAccepted,     setTermsAccepted]     = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!termsAccepted) {
      setError(t("errorTerms"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("errorPassMatch"));
      return;
    }

    if (formData.password.length < 8) {
      setError(t("errorPassLength"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          terms_accepted_at: new Date().toISOString(),
          marketing_consent: marketingAccepted,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? t("errorDefault"));
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data.sessionCreated) {
        router.push("/onboarding");
        router.refresh();
      } else {
        setRegistered(true);
      }
    } catch {
      setError(t("errorDefault"));
    } finally {
      setLoading(false);
    }
  }

  if (registered) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{t("checkEmail")}</h1>
        <p className="text-gray-500 text-sm mb-2 max-w-xs mx-auto">
          {t("checkEmailDesc", { email: formData.email })}
        </p>
        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
          {t("checkEmailDesc2")}
        </p>
        <p className="text-xs text-gray-400">{t("checkEmailSpam")}</p>
        <div className="mt-6">
          <Link href="/login" className="text-sm text-brand-600 font-medium hover:underline">
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-6">{t("subtitle")}</p>

      <GoogleButton label={t("googleLabel")} />

      <p className="text-xs text-gray-400 text-center mt-2 leading-relaxed">
        {t.rich("googleConsent", {
          terms: (chunks) => (
            <Link href="/terminos" className="underline hover:text-gray-600">{chunks}</Link>
          ),
          privacy: (chunks) => (
            <Link href="/privacidad" className="underline hover:text-gray-600">{chunks}</Link>
          ),
        })}
      </p>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-gray-400">{t("orRegisterEmail")}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            aria-required="true"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            aria-required="true"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
            placeholder={t("passwordPlaceholder")}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {t("confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            aria-required="true"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-3 pt-1">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-600
                         focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-sm text-gray-600 leading-snug">
              {t.rich("termsLabel", {
                terms: (chunks) => (
                  <Link href="/terminos" target="_blank" className="text-brand-600 underline hover:text-brand-700 font-medium">{chunks}</Link>
                ),
                privacy: (chunks) => (
                  <Link href="/privacidad" target="_blank" className="text-brand-600 underline hover:text-brand-700 font-medium">{chunks}</Link>
                ),
              })}
              <span className="text-red-500 ml-0.5">*</span>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={marketingAccepted}
              onChange={(e) => setMarketingAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-600
                         focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-sm text-gray-600 leading-snug">
              {t("marketingLabel")}
              {" "}<span className="text-gray-400 text-xs">{t("marketingOptional")}</span>
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-brand-600 font-medium hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </div>
  );
}
