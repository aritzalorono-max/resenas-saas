"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_WELCOME_MESSAGE } from "@/lib/constants";
import type { Business, BusinessTone, ReviewPlatformLink, WhatsAppLanguage, WhatsAppMode } from "@/types";
import { useTranslations } from "next-intl";

const PLATFORMS: { name: string; placeholder: string }[] = [
  { name: "Google Maps",  placeholder: "https://maps.app.goo.gl/..." },
  { name: "Trustpilot",  placeholder: "https://www.trustpilot.com/review/tu-negocio.com" },
  { name: "App Store",   placeholder: "https://apps.apple.com/app/idXXXXXXXXXX" },
  { name: "Play Store",  placeholder: "https://play.google.com/store/apps/details?id=com.tu.app" },
  { name: "TripAdvisor", placeholder: "https://www.tripadvisor.es/..." },
  { name: "Booking.com", placeholder: "https://www.booking.com/hotel/..." },
  { name: "Yelp",        placeholder: "https://www.yelp.com/biz/tu-negocio" },
  { name: "Facebook",    placeholder: "https://www.facebook.com/tu-negocio/reviews" },
  { name: "Otra",        placeholder: "https://..." },
];


export default function ConfiguracionPage() {
  const t = useTranslations("configuracion");
  const tCommon = useTranslations("common");

  const TONE_OPTIONS: { value: BusinessTone; label: string; sublabel: string; example: string }[] = [
    {
      value: "tuteo",
      label: t("toneTuteoLabel"),
      sublabel: t("toneTuteoSublabel"),
      example: t("toneTuteoExample"),
    },
    {
      value: "usted",
      label: t("toneUstedLabel"),
      sublabel: t("toneUstedSublabel"),
      example: t("toneUstedExample"),
    },
    {
      value: "juvenil",
      label: t("toneJuvenilLabel"),
      sublabel: t("toneJuvenilSublabel"),
      example: t("toneJuvenilExample"),
    },
  ];

  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website_url: "",
    activePlatformName: "Google Maps",
    activeShortCode: undefined as string | undefined,
    google_maps_url: "",
    otherPlatforms: [] as ReviewPlatformLink[],
    welcome_message: "",
    tone: "tuteo" as BusinessTone,
    whatsapp_language: "es" as WhatsAppLanguage,
  });
  const [whatsappMode, setWhatsappMode]         = useState<WhatsAppMode>("shared");
  const [reminderMaxCount, setReminderMaxCount] = useState<0 | 1 | 2>(2);
  const [ownAccountSid, setOwnAccountSid]       = useState("");
  const [ownAuthToken, setOwnAuthToken]         = useState("");
  const [ownWhatsappNumber, setOwnWhatsappNumber] = useState("");
  const [showOwnToken, setShowOwnToken]         = useState(false);

  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");
  const [generatingMsg, setGeneratingMsg] = useState(false);
  const [toneExpanded, setToneExpanded]       = useState(false);
  const [showLinkHelp, setShowLinkHelp]       = useState(false);
  const [addingPlatform, setAddingPlatform]   = useState(false);
  const [newPlatformName, setNewPlatformName] = useState("Google Maps");
  const [newPlatformUrl, setNewPlatformUrl]   = useState("");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error: dbError } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (dbError && dbError.code !== "PGRST116") {
          setError(t("errorLoad"));
          return;
        }

        let businessData = data;
        if (!businessData) {
          const { data: created, error: createError } = await supabase
            .from("businesses")
            .insert({ user_id: user.id, name: user.email ?? "Mi negocio", welcome_message: DEFAULT_WELCOME_MESSAGE })
            .select("*")
            .single();
          if (createError) {
            setError(t("errorInit"));
            return;
          }
          businessData = created;
        }

        if (businessData) {
          setBusiness(businessData);
          setWhatsappMode((businessData.whatsapp_mode as WhatsAppMode) ?? "shared");
          setReminderMaxCount((businessData.reminder_max_count ?? 2) as 0 | 1 | 2);
          setOwnAccountSid(businessData.own_twilio_account_sid ?? "");
          setOwnAuthToken(businessData.own_twilio_auth_token ?? "");
          setOwnWhatsappNumber(businessData.own_twilio_whatsapp_number ?? "");
          const links: ReviewPlatformLink[] = businessData.review_links ?? [];
          const active = links.find((l) => l.url === businessData.google_maps_url);
          const others = links.filter((l) => l.url !== businessData.google_maps_url);
          setForm({
            name: businessData.name ?? "",
            description: businessData.description ?? "",
            website_url: businessData.website_url ?? "",
            activePlatformName: active?.name ?? "Google Maps",
            activeShortCode: active?.shortCode,
            google_maps_url: businessData.google_maps_url ?? "",
            otherPlatforms: others,
            welcome_message: businessData.welcome_message ?? DEFAULT_WELCOME_MESSAGE,
            tone: businessData.tone ?? "tuteo",
            whatsapp_language: (businessData.whatsapp_language as WhatsAppLanguage) ?? "es",
          });
        }
      } catch {
        setError(t("errorConnection"));
      } finally {
        setLoading(false);
      }
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
      setError(t("errorGenerateMsg"));
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

    if (!business) {
      setError(t("errorLoad"));
      return;
    }

    setSaving(true);

    const review_links: ReviewPlatformLink[] = [
      ...(form.google_maps_url
        ? [{ name: form.activePlatformName, url: form.google_maps_url, shortCode: form.activeShortCode }]
        : []),
      ...(Array.isArray(form.otherPlatforms) ? form.otherPlatforms : []),
    ];

    try {
      const res = await fetch("/api/configuracion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          website_url: form.website_url,
          google_maps_url: form.google_maps_url,
          review_links,
          welcome_message: form.welcome_message,
          tone: form.tone,
          whatsapp_language: form.whatsapp_language,
          whatsapp_mode: whatsappMode,
          reminder_max_count: reminderMaxCount,
          own_twilio_account_sid: ownAccountSid,
          own_twilio_auth_token: ownAuthToken,
          own_twilio_whatsapp_number: ownWhatsappNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t("errorSave"));
        return;
      }

      const savedLinks: ReviewPlatformLink[] = data.review_links ?? review_links;
      const savedActive = savedLinks.find((l) => l.url === form.google_maps_url);
      setForm((p) => ({
        ...p,
        activeShortCode: savedActive?.shortCode,
        otherPlatforms: savedLinks.filter((l) => l.url !== p.google_maps_url),
      }));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("[ResenasYa] Error de red al guardar:", err);
      setError(t("errorNetwork"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">{tCommon("loading")}</div>;
  }

  if (!business && error) {
    return (
      <div className="max-w-lg">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-semibold text-red-700 underline hover:no-underline"
          >
            {t("reloadPage")}
          </button>
        </div>
      </div>
    );
  }

  const currentTone = TONE_OPTIONS.find((o) => o.value === form.tone)!;
  const activePlaceholder = PLATFORMS.find((p) => p.name === form.activePlatformName)?.placeholder ?? "https://...";
  const newPlaceholder    = PLATFORMS.find((p) => p.name === newPlatformName)?.placeholder ?? "https://...";

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Business data ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">{t("businessDataTitle")}</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("businessName")} *
            </label>
            <input
              id="name" name="name" type="text" value={form.name} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder={t("businessNamePlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("description")}
            </label>
            <textarea
              id="description" name="description" value={form.description} onChange={handleChange}
              rows={2} maxLength={200}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none"
              placeholder={t("descriptionPlaceholder")}
            />
            <p className="text-xs text-gray-400 mt-1">{form.description.length}/200</p>
          </div>

          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("websiteUrl")}
            </label>
            <input
              id="website_url" name="website_url" type="url" value={form.website_url} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder={t("websiteUrlPlaceholder")}
            />
          </div>
        </div>

        {/* ── Review platforms ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">{t("platformsTitle")}</h2>

          {/* Active platform */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">
                {t("activeLinkLabel")} <span className="text-gray-400 font-normal">{t("activeLinkDesc")}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowLinkHelp((v) => !v)}
                className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium transition"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                {t("howToGetLink")}
              </button>
            </div>

            {showLinkHelp && (
              <div className="mb-3 bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">{t("linkHelpTitle")}</p>
                <ol className="space-y-1.5 text-xs text-blue-700 list-none">
                  <li>{t.rich("linkHelpStep1", { b: (c) => <strong key="s1">{c}</strong> })}</li>
                  <li>{t("linkHelpStep2")}</li>
                  <li>{t.rich("linkHelpStep3", { b: (c) => <strong key="s3">{c}</strong> })}</li>
                  <li>{t("linkHelpStep4")} <code className="bg-blue-100 px-1 rounded">{t("linkHelpStep4code")}</code></li>
                </ol>
                <p className="text-xs text-blue-500">{t("linkHelpNote")}</p>
              </div>
            )}
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
              {form.google_maps_url && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, google_maps_url: "", activeShortCode: undefined }))}
                  className="shrink-0 text-gray-400 hover:text-red-500 transition text-lg leading-none px-1"
                  title={t("clearLink")}
                >
                  ×
                </button>
              )}
            </div>
            {form.google_maps_url ? (
              <div className="mt-2 space-y-1">
                {form.activeShortCode ? (
                  <p className="text-xs text-gray-700">
                    <span className="text-gray-400">{t("whatsappLinkLabel")} </span>
                    <span className="font-semibold text-brand-600">
                      {typeof window !== "undefined" ? window.location.origin : ""}/r/{form.activeShortCode}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">{t("shortCodePending")}</p>
                )}
                <p className="text-xs text-gray-400">
                  {t("linkDestination")}{" "}
                  <a href={form.google_maps_url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                    {form.google_maps_url}
                  </a>
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-2">{t("noLinkHint")}</p>
            )}
          </div>

          {/* Additional platforms */}
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
                    {t("activate")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePlatform(link.url)}
                    className="text-xs text-gray-400 hover:text-red-500 shrink-0"
                  >
                    {t("remove")}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add platform */}
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
                  aria-label={t("cancel")}
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
                  {t("addBtn")}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button" onClick={() => setAddingPlatform(true)}
              className="text-sm text-brand-600 hover:text-brand-800 font-medium"
            >
              {t("addPlatform")}
            </button>
          )}
        </div>

        {/* ── Communication tone ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">{t("tone")}</h2>
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
                {t("change")}
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

        {/* ── WhatsApp message language ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">{t("whatsappLanguageTitle")}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{t("whatsappLanguageDesc")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {([
              { value: "es", label: t("langEs"), flag: "🇪🇸" },
              { value: "en", label: t("langEn"), flag: "🇬🇧" },
              { value: "fr", label: t("langFr"), flag: "🇫🇷" },
              { value: "de", label: t("langDe"), flag: "🇩🇪" },
              { value: "it", label: t("langIt"), flag: "🇮🇹" },
              { value: "pt", label: t("langPt"), flag: "🇵🇹" },
            ] as { value: WhatsAppLanguage; label: string; flag: string }[]).map((opt) => {
              const selected = form.whatsapp_language === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, whatsapp_language: opt.value }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition ${
                    selected ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="text-base leading-none">{opt.flag}</span>
                  <span>{opt.label}</span>
                  {selected && <span className="ml-auto w-2 h-2 rounded-full bg-brand-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Welcome message ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">{t("welcomeMessage")}</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {t("welcomeHintPrefix")} <code className="bg-gray-100 px-1 rounded">{"{nombre}"}</code> {t("welcomeHintAnd")}{" "}
                <code className="bg-gray-100 px-1 rounded">{"{negocio}"}</code> {t("welcomeHintSuffix")}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateMessage}
              disabled={generatingMsg || !form.name || whatsappMode !== "own"}
              className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title={!form.name ? t("generateHintNoName") : t("generateHint")}
            >
              {generatingMsg ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  {t("generatingBtn")}
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
                  </svg>
                  {t("generateAIBtn")}
                </>
              )}
            </button>
          </div>

          {whatsappMode !== "own" ? (
            <>
              <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {t.rich("sharedModeWarning", { strong: (c) => <strong key="smw">{c}</strong> })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">{t("sharedPreviewLabel")}</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {t("sharedPreviewMsg", { name: form.name || t("yourBusiness") })}
                </p>
              </div>
            </>
          ) : (
            <>
              <textarea
                id="welcome_message" name="welcome_message" value={form.welcome_message}
                onChange={handleChange} rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none"
                placeholder={t("welcomePlaceholder")}
              />
              {form.welcome_message && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-2">{t("previewLabel")}</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {form.welcome_message
                      .replace("{nombre}", t("sampleCustomerName"))
                      .replace("{negocio}", form.name || t("yourBusiness"))}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Automatic reminders ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">{t("remindersTitle")}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{t("remindersDesc")}</p>
          </div>
          <div className="space-y-2 mt-2">
            {([
              { value: 0, label: t("reminders0Label"), desc: "" },
              { value: 1, label: t("reminders1Label"), desc: t("reminders1Desc") },
              { value: 2, label: t("reminders2Label"), desc: t("reminders2Desc") },
            ] as { value: 0|1|2; label: string; desc: string }[]).map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setReminderMaxCount(value)}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 transition ${reminderMaxCount === value ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${reminderMaxCount === value ? "border-brand-600" : "border-gray-300"}`}>
                  {reminderMaxCount === value && <span className="w-2 h-2 rounded-full bg-brand-600" />}
                </span>
                <div>
                  <span className={`text-sm font-medium ${reminderMaxCount === value ? "text-brand-700" : "text-gray-700"}`}>{label}</span>
                  {desc && <span className="text-xs text-gray-400 ml-2">{desc}</span>}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">{t("remindersBillingNote")}</p>
        </div>

        {/* ── WhatsApp number ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">{t("whatsappTitle")}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{t("whatsappDesc")}</p>
          </div>

          <div className="space-y-3">

            {/* Option 1: Shared */}
            <button
              type="button"
              onClick={() => setWhatsappMode("shared")}
              className={`w-full text-left rounded-xl border-2 p-4 transition ${whatsappMode === "shared" ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${whatsappMode === "shared" ? "border-brand-500" : "border-gray-300"}`}>
                  {whatsappMode === "shared" && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                </span>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{t("sharedTitle")}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t("sharedDesc")}</p>
                </div>
              </div>
            </button>

            {/* Option 2: Own */}
            <div className={`rounded-xl border-2 transition ${whatsappMode === "own" ? "border-brand-500 bg-brand-50" : "border-gray-200"}`}>
              <button
                type="button"
                onClick={() => setWhatsappMode("own")}
                className="w-full text-left p-4"
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${whatsappMode === "own" ? "border-brand-500" : "border-gray-300"}`}>
                    {whatsappMode === "own" && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t("ownTitle")}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t("ownDesc")}</p>
                  </div>
                </div>
              </button>

              {whatsappMode === "own" && (
                <div className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t("twilioAccountSid")}</label>
                      <input
                        type="text"
                        value={ownAccountSid}
                        onChange={(e) => setOwnAccountSid(e.target.value)}
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t("twilioAuthToken")}</label>
                      <div className="relative">
                        <input
                          type={showOwnToken ? "text" : "password"}
                          value={ownAuthToken}
                          onChange={(e) => setOwnAuthToken(e.target.value)}
                          placeholder="••••••••••••••••••••••••••••••••"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                        />
                        <button type="button" onClick={() => setShowOwnToken((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                          {showOwnToken ? t("hideToken") : t("showToken")}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t("ownWhatsappNumberLabel")}</label>
                      <input
                        type="text"
                        value={ownWhatsappNumber}
                        onChange={(e) => setOwnWhatsappNumber(e.target.value)}
                        placeholder="+34612345678"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <details className="bg-amber-50 border border-amber-100 rounded-lg">
                    <summary className="px-4 py-3 text-sm font-semibold text-amber-800 cursor-pointer select-none">
                      {t("setupGuideTitle")}
                    </summary>
                    <ol className="px-4 pb-4 mt-1 space-y-3 text-xs text-amber-900 list-decimal list-inside leading-relaxed">
                      <li>{t.rich("setupStep1", { strong: (c) => <strong key="ss1">{c}</strong>, em: (c) => <em key="se1">{c}</em> })}</li>
                      <li>{t.rich("setupStep2", { strong: (c) => <strong key="ss2">{c}</strong>, em: (c) => <em key="se2">{c}</em> })}</li>
                      <li>{t.rich("setupStep3", { strong: (c) => <strong key="ss3">{c}</strong>, em: (c) => <em key="se3">{c}</em> })}</li>
                      <li>{t.rich("setupStep4", { strong: (c) => <strong key="ss4">{c}</strong>, em: (c) => <em key="se4">{c}</em> })}</li>
                      <li>{t.rich("setupStep5", { strong: (c) => <strong key="ss5">{c}</strong>, em: (c) => <em key="se5">{c}</em> })}</li>
                    </ol>
                    <div className="mx-4 mb-4 bg-white border border-amber-200 rounded px-3 py-2 font-mono text-xs text-gray-700 break-all">
                      {typeof window !== "undefined" ? window.location.origin : "https://tu-dominio.com"}/api/twilio-webhook
                    </div>
                  </details>
                </div>
              )}
            </div>

            {/* Option 3: Dedicated */}
            <button
              type="button"
              onClick={() => setWhatsappMode("dedicated")}
              className={`w-full text-left rounded-xl border-2 p-4 transition ${whatsappMode === "dedicated" ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${whatsappMode === "dedicated" ? "border-brand-500" : "border-gray-300"}`}>
                  {whatsappMode === "dedicated" && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900">{t("dedicatedTitle")}</p>
                    <span className="text-[10px] font-semibold bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">{t("comingSoon")}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{t("dedicatedDesc")}</p>
                  {whatsappMode === "dedicated" && (
                    <p className="text-xs text-brand-700 font-medium mt-2">{t("dedicatedContact")}</p>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">
            ✅ {t("saved")}
          </div>
        )}

        <button
          type="submit" disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition"
        >
          {saving ? t("saving") : t("save")}
        </button>
      </form>

      {/* ── Quick access (mobile only) ── */}
      <div className="mt-8 lg:hidden">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t("moreOptions")}</p>
        <div className="grid grid-cols-3 gap-3">
          {([
            { href: "/incentivos", label: t("quickIncentivos"),  emoji: "🎁" },
            { href: "/cartel",     label: t("quickCartel"),      emoji: "🖨️" },
            { href: "/facturacion",label: t("quickFacturacion"), emoji: "💳" },
          ] as const).map(({ href, label, emoji }) => (
            <a
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-200 transition"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">{label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Webhook URL (own mode only) ── */}
      {whatsappMode === "own" && (
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t("webhookLabel")}</p>
          <code className="block bg-white border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-mono break-all">
            {typeof window !== "undefined" ? window.location.origin : "https://tu-dominio.com"}/api/twilio-webhook
          </code>
        </div>
      )}
    </div>
  );
}
