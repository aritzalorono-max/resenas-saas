"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CreditCard, FileText, Building2, User, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface BillingInfo {
  tipo: "particular" | "empresa";
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
  pais: string;
  email_facturacion: string;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  plan: string;
  status: "paid" | "pending" | "failed" | "refunded";
  description: string | null;
  invoice_url: string | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
}

interface Subscription {
  subscription_plan: "free" | "starter" | "pro";
  subscription_status: string;
  subscription_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

const EMPTY: BillingInfo = {
  tipo: "particular",
  nombre: "",
  nif: "",
  direccion: "",
  ciudad: "",
  codigo_postal: "",
  pais: "",
  email_facturacion: "",
};

export default function FacturacionPage() {
  const t      = useTranslations("facturacion");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [form, setForm]             = useState<BillingInfo>(EMPTY);
  const [payments, setPayments]     = useState<Payment[]>([]);
  const [sub, setSub]               = useState<Subscription | null>(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");
  const [portalLoading, setPortalLoading]     = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError]     = useState("");

  const stripeSuccess  = searchParams.get("success")  === "1";
  const stripeCanceled = searchParams.get("canceled") === "1";

  function fmtAmount(amount: number, currency: string) {
    return new Intl.NumberFormat(locale, { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const statusConfig: Record<Payment["status"], { label: string; cls: string }> = {
    paid:     { label: t("statusPaid"),     cls: "bg-green-100 text-green-700"   },
    pending:  { label: t("statusPending"),  cls: "bg-yellow-100 text-yellow-700" },
    failed:   { label: t("statusFailed"),   cls: "bg-red-100 text-red-700"       },
    refunded: { label: t("statusRefunded"), cls: "bg-gray-100 text-gray-600"     },
  };

  const planConfig = {
    free:    { label: t("planFree"),    cls: "bg-gray-100 text-gray-700",   limit: t("planFreeLimit")    },
    starter: { label: "Starter",        cls: "bg-blue-100 text-blue-700",   limit: t("planStarterLimit") },
    pro:     { label: "Pro",            cls: "bg-brand-100 text-brand-700", limit: t("planProLimit")     },
  };

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: billing }, { data: pays }, { data: business }] = await Promise.all([
        supabase.from("billing_info").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("businesses")
          .select("subscription_plan, subscription_status, subscription_period_end, stripe_customer_id, stripe_subscription_id")
          .eq("user_id", user.id)
          .single(),
      ]);

      if (billing) {
        setForm({
          tipo:              billing.tipo              ?? "particular",
          nombre:            billing.nombre            ?? "",
          nif:               billing.nif               ?? "",
          direccion:         billing.direccion         ?? "",
          ciudad:            billing.ciudad            ?? "",
          codigo_postal:     billing.codigo_postal     ?? "",
          pais:              billing.pais              ?? "",
          email_facturacion: billing.email_facturacion ?? "",
        });
      }
      setPayments((pays ?? []) as Payment[]);
      if (business) setSub(business as Subscription);
      setLoading(false);
    }
    load();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.nombre.trim())        { setError(t("errorName")); return; }
    if (!form.nif.trim())           { setError(t("errorNif", { code: form.tipo === "empresa" ? t("cif") : t("nif") })); return; }
    if (!form.direccion.trim())     { setError(t("errorAddress")); return; }
    if (!form.ciudad.trim())        { setError(t("errorCity")); return; }
    if (!form.codigo_postal.trim()) { setError(t("errorPostCode")); return; }
    if (!form.pais.trim())          { setError(t("errorCountry")); return; }
    if (form.email_facturacion?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_facturacion.trim())) {
      setError(t("errorEmailInvalid")); return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/facturacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? t("errorSave"));
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setSaving(false);
    }
  }

  async function handleCheckout(plan: "starter" | "pro") {
    setCheckoutLoading(plan);
    setCheckoutError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error ?? t("errorPayment"));
        setCheckoutLoading(null);
      }
    } catch {
      setCheckoutError(t("errorNetworkShort"));
      setCheckoutLoading(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error ?? t("errorPortal"));
    } catch {
      setError(t("errorNetworkShort"));
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  const currentPlan = sub?.subscription_plan ?? "free";
  const planCfg     = planConfig[currentPlan];
  const isActive    = sub?.subscription_status === "active" || sub?.subscription_status === "trialing";
  const hasStripe   = !!sub?.stripe_customer_id;

  const planCards = [
    {
      key: "starter" as const,
      price: "9,9€",
      limit: t("planStarterLimit"),
      features: [t("featMapsPlus"), t("featAI"), t("featMetrics"), t("featEmail")],
    },
    {
      key: "pro" as const,
      price: "29,9€",
      limit: t("planProLimit"),
      features: [t("featAllPlatforms"), t("featAI"), t("featIncentives"), t("featExport")],
      highlight: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Stripe feedback */}
      {stripeSuccess && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0 text-green-600" />
          {t("stripeSuccess")}
        </div>
      )}
      {stripeCanceled && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-600" />
          {t("stripeCanceled")}
        </div>
      )}

      {/* ── Current plan ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-gray-900">{t("currentPlan")}</h2>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${planCfg.cls}`}>
                {planCfg.label}
              </span>
              {sub?.subscription_status === "past_due" && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                  {t("pastDue")}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{planCfg.limit}</p>
            {isActive && sub?.subscription_period_end && (
              <p className="text-xs text-gray-400 mt-1">
                {t("nextRenewal", { date: fmtDate(sub.subscription_period_end) })}
              </p>
            )}
          </div>
          {hasStripe && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 border border-brand-200 hover:border-brand-300 px-4 py-2 rounded-lg transition disabled:opacity-60"
            >
              {portalLoading ? t("opening") : t("manageBtn")}
            </button>
          )}
        </div>

        {/* Upgrade cards */}
        {!isActive && (
          <>
            <p className="text-sm font-medium text-gray-700 mb-3">{t("upgradePlan")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planCards.map((p) => (
                <div
                  key={p.key}
                  className={`rounded-xl border p-4 ${p.highlight ? "border-brand-300 bg-brand-50" : "border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 capitalize">{p.key}</span>
                    <span className="font-extrabold text-gray-900">
                      {p.price}<span className="text-gray-400 font-normal text-xs">{t("perMonth")}</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{p.limit}</p>
                  <ul className="space-y-1 mb-4">
                    {p.features.map((f) => (
                      <li key={f} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-brand-500 mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleCheckout(p.key)}
                    disabled={!!checkoutLoading}
                    className={`w-full py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60 ${
                      p.highlight
                        ? "bg-brand-600 hover:bg-brand-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    {checkoutLoading === p.key ? t("redirecting") : t("subscribeBtn", { plan: p.key })}
                  </button>
                </div>
              ))}
            </div>
            {checkoutError && (
              <div className="mt-3 bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{checkoutError}</div>
            )}
            <p className="text-xs text-gray-400 mt-3 text-center">{t("cancelNote")}</p>
          </>
        )}

        {isActive && (
          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
            {t.rich("activeNote", { strong: (c) => <strong className="text-gray-600">{c}</strong> })}
          </div>
        )}
      </section>

      {/* ── Billing details ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <FileText className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-gray-900">{t("billingDataTitle")}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("type")}</label>
            <div className="grid grid-cols-2 gap-3">
              {(["particular", "empresa"] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, tipo }))}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition
                    ${form.tipo === tipo
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  {tipo === "particular" ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  {tipo === "particular" ? t("individual") : t("company")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              {form.tipo === "empresa" ? t("companyName") : t("fullName")}
            </label>
            <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={handleChange}
              placeholder={form.tipo === "empresa" ? t("companyNamePlaceholder") : t("fullNamePlaceholder")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm" />
          </div>

          <div>
            <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-1">
              {form.tipo === "empresa" ? t("cif") : t("nif")}
            </label>
            <input id="nif" name="nif" type="text" value={form.nif} onChange={handleChange}
              placeholder={form.tipo === "empresa" ? t("cifPlaceholder") : t("nifPlaceholder")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm" />
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">{t("address")}</label>
            <input id="direccion" name="direccion" type="text" value={form.direccion} onChange={handleChange}
              placeholder={t("addressPlaceholder")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">{t("city")}</label>
              <input id="ciudad" name="ciudad" type="text" value={form.ciudad} onChange={handleChange}
                placeholder={t("cityPlaceholder")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm" />
            </div>
            <div>
              <label htmlFor="codigo_postal" className="block text-sm font-medium text-gray-700 mb-1">{t("postCode")}</label>
              <input id="codigo_postal" name="codigo_postal" type="text" value={form.codigo_postal} onChange={handleChange}
                placeholder={t("postCodePlaceholder")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm" />
            </div>
          </div>

          <div>
            <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-1">{t("country")}</label>
            <input id="pais" name="pais" type="text" value={form.pais} onChange={handleChange}
              placeholder={t("countryPlaceholder")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm" />
          </div>

          <div>
            <label htmlFor="email_facturacion" className="block text-sm font-medium text-gray-700 mb-1">
              {t("invoiceEmail")} <span className="text-gray-400 font-normal">{t("optional")}</span>
            </label>
            <input id="email_facturacion" name="email_facturacion" type="email" value={form.email_facturacion} onChange={handleChange}
              placeholder={t("invoiceEmailPlaceholder")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm" />
          </div>

          {error   && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">{t("savedOk")}</div>}

          <button type="submit" disabled={saving}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition text-sm">
            {saving ? t("saving") : t("saveBtn")}
          </button>
        </form>
      </section>

      {/* ── Payment history ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-gray-900">{t("paymentsTitle")}</h2>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-10">
            <CreditCard className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">{t("noPayments")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">{t("colDate")}</th>
                  <th className="text-left px-6 py-3 font-medium">{t("colDescription")}</th>
                  <th className="text-left px-6 py-3 font-medium">{t("colStatus")}</th>
                  <th className="text-right px-6 py-3 font-medium">{t("colAmount")}</th>
                  <th className="text-right px-6 py-3 font-medium">{t("colInvoice")}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const st = statusConfig[p.status] ?? statusConfig.pending;
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">{fmtDate(p.created_at)}</td>
                      <td className="px-6 py-3.5 text-gray-800">
                        {p.description ?? t("planLabel", { plan: p.plan })}
                        {p.period_start && p.period_end && (
                          <span className="text-gray-400 text-xs block mt-0.5">
                            {fmtDate(p.period_start)} – {fmtDate(p.period_end)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-gray-900 whitespace-nowrap">
                        {fmtAmount(p.amount, p.currency)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {p.invoice_url ? (
                          <a href={p.invoice_url} target="_blank" rel="noopener noreferrer"
                            className="text-brand-600 hover:underline text-xs font-medium">
                            {t("viewPdf")}
                          </a>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
