"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CreditCard, FileText, Building2, User } from "lucide-react";

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

const STATUS_CONFIG: Record<Payment["status"], { label: string; cls: string }> = {
  paid:     { label: "Pagado",    cls: "bg-green-100 text-green-700" },
  pending:  { label: "Pendiente", cls: "bg-yellow-100 text-yellow-700" },
  failed:   { label: "Fallido",   cls: "bg-red-100 text-red-700" },
  refunded: { label: "Reembolso", cls: "bg-gray-100 text-gray-600" },
};

function fmtAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const EMPTY: BillingInfo = {
  tipo: "particular",
  nombre: "",
  nif: "",
  direccion: "",
  ciudad: "",
  codigo_postal: "",
  pais: "España",
  email_facturacion: "",
};

export default function FacturacionPage() {
  const [form, setForm]       = useState<BillingInfo>(EMPTY);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: billing }, { data: pays }] = await Promise.all([
        supabase.from("billing_info").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
      ]);

      if (billing) {
        setForm({
          tipo: billing.tipo ?? "particular",
          nombre: billing.nombre ?? "",
          nif: billing.nif ?? "",
          direccion: billing.direccion ?? "",
          ciudad: billing.ciudad ?? "",
          codigo_postal: billing.codigo_postal ?? "",
          pais: billing.pais ?? "España",
          email_facturacion: billing.email_facturacion ?? "",
        });
      }
      setPayments((pays ?? []) as Payment[]);
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
    setSaving(true);
    try {
      const res = await fetch("/api/facturacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Error al guardar los datos");
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("Error de red. Comprueba tu conexión e inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona tus datos de facturación e historial de pagos</p>
      </div>

      {/* ── Datos de facturación ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <FileText className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-gray-900">Datos de facturación</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <div className="grid grid-cols-2 gap-3">
              {(["particular", "empresa"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, tipo: t }))}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition
                    ${form.tipo === t
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  {t === "particular" ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  {t === "particular" ? "Particular" : "Empresa"}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre / Razón social */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              {form.tipo === "empresa" ? "Razón social" : "Nombre completo"}
            </label>
            <input
              id="nombre" name="nombre" type="text"
              value={form.nombre} onChange={handleChange}
              placeholder={form.tipo === "empresa" ? "Mi Empresa S.L." : "Juan García López"}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          {/* NIF / CIF */}
          <div>
            <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-1">
              {form.tipo === "empresa" ? "CIF" : "NIF / NIE"}
            </label>
            <input
              id="nif" name="nif" type="text"
              value={form.nif} onChange={handleChange}
              placeholder={form.tipo === "empresa" ? "B12345678" : "12345678A"}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              id="direccion" name="direccion" type="text"
              value={form.direccion} onChange={handleChange}
              placeholder="Calle Mayor 1, 2º A"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          {/* Ciudad + CP */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input
                id="ciudad" name="ciudad" type="text"
                value={form.ciudad} onChange={handleChange}
                placeholder="Madrid"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
              />
            </div>
            <div>
              <label htmlFor="codigo_postal" className="block text-sm font-medium text-gray-700 mb-1">Código postal</label>
              <input
                id="codigo_postal" name="codigo_postal" type="text"
                value={form.codigo_postal} onChange={handleChange}
                placeholder="28001"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
              />
            </div>
          </div>

          {/* País */}
          <div>
            <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <input
              id="pais" name="pais" type="text"
              value={form.pais} onChange={handleChange}
              placeholder="España"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          {/* Email de facturación */}
          <div>
            <label htmlFor="email_facturacion" className="block text-sm font-medium text-gray-700 mb-1">
              Email para facturas <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              id="email_facturacion" name="email_facturacion" type="email"
              value={form.email_facturacion} onChange={handleChange}
              placeholder="facturas@miempresa.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">Datos guardados correctamente</div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition text-sm"
          >
            {saving ? "Guardando..." : "Guardar datos de facturación"}
          </button>
        </form>
      </section>

      {/* ── Historial de pagos ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-gray-900">Historial de pagos</h2>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-10">
            <CreditCard className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No hay pagos registrados todavía</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">Fecha</th>
                  <th className="text-left px-6 py-3 font-medium">Descripción</th>
                  <th className="text-left px-6 py-3 font-medium">Estado</th>
                  <th className="text-right px-6 py-3 font-medium">Importe</th>
                  <th className="text-right px-6 py-3 font-medium">Factura</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const st = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.pending;
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">{fmtDate(p.created_at)}</td>
                      <td className="px-6 py-3.5 text-gray-800">
                        {p.description ?? `Plan ${p.plan}`}
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
                          <a
                            href={p.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-600 hover:underline text-xs font-medium"
                          >
                            Ver PDF
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
