"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Gift, ToggleLeft, ToggleRight, Upload, RefreshCw,
  CheckCircle, Clock, XCircle, Shuffle, ListOrdered,
  ChevronDown, Ticket,
} from "lucide-react";
import type { DiscountCode, IncentiveCodeType } from "@/types";

type FilterStatus = "all" | "available" | "used" | "expired";

interface Stats {
  total: number;
  available: number;
  used: number;
  rewarded: number;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  available: { label: "Disponible", color: "bg-green-100 text-green-700" },
  used:      { label: "Enviado",    color: "bg-blue-100 text-blue-700"  },
  expired:   { label: "Expirado",   color: "bg-gray-100 text-gray-500"  },
};

export default function IncentivosPage() {
  const [businessId, setBusinessId]         = useState<string | null>(null);
  const [codeEnabled, setCodeEnabled]       = useState(false);
  const [codeType, setCodeType]             = useState<IncentiveCodeType>("random");
  const [codes, setCodes]                   = useState<DiscountCode[]>([]);
  const [stats, setStats]                   = useState<Stats>({ total: 0, available: 0, used: 0, rewarded: 0 });
  const [filter, setFilter]                 = useState<FilterStatus>("all");
  const [loading, setLoading]               = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [uploading, setUploading]           = useState(false);
  const [uploadResult, setUploadResult]     = useState<string | null>(null);
  const [uploadError, setUploadError]       = useState<string | null>(null);
  const fileInputRef                        = useRef<HTMLInputElement>(null);

  async function load(bId?: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: biz } = await supabase
      .from("businesses")
      .select("id, incentive_code_enabled, incentive_code_type")
      .eq("user_id", user.id)
      .single();

    if (!biz) return;
    const id = bId ?? biz.id;
    setBusinessId(id);
    setCodeEnabled(biz.incentive_code_enabled ?? false);
    setCodeType(biz.incentive_code_type ?? "random");

    // Load codes
    const { data: codesData } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("business_id", id)
      .order("created_at", { ascending: false })
      .limit(500);

    const allCodes = (codesData ?? []) as DiscountCode[];
    setCodes(allCodes);

    // Stats
    const available = allCodes.filter((c) => c.status === "available").length;
    const used      = allCodes.filter((c) => c.status === "used").length;

    // Count rewarded review_requests that have a discount code
    const { count: rewarded } = await supabase
      .from("review_requests")
      .select("id", { count: "exact", head: true })
      .eq("businesses.user_id", user.id)
      .not("discount_code", "is", null)
      .eq("status", "rewarded");

    setStats({ total: allCodes.length, available, used, rewarded: rewarded ?? 0 });
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function saveSettings() {
    if (!businessId) return;
    setSavingSettings(true);
    setSettingsSuccess(false);
    const supabase = createClient();
    await supabase
      .from("businesses")
      .update({ incentive_code_enabled: codeEnabled, incentive_code_type: codeType })
      .eq("id", businessId);
    setSavingSettings(false);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2500);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadResult(null);
    setUploadError(null);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/codes/upload", { method: "POST", body: form });
    const body = await res.json().catch(() => ({}));

    if (res.ok) {
      setUploadResult(`${body.inserted} códigos nuevos añadidos (${body.total} en el archivo)`);
      await load(businessId ?? undefined);
    } else {
      setUploadError(body.error ?? "Error al subir el archivo");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const filteredCodes = filter === "all" ? codes : codes.filter((c) => c.status === filter);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Códigos de descuento</h1>
        <p className="text-gray-500 mt-1">
          Envía códigos de descuento como incentivo para conseguir más reseñas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total emitidos",  value: stats.total,     icon: Ticket,      color: "text-brand-600 bg-brand-50" },
          { label: "Disponibles",     value: stats.available,  icon: CheckCircle, color: "text-green-600 bg-green-50" },
          { label: "Enviados",        value: stats.used,       icon: Clock,       color: "text-blue-600 bg-blue-50"   },
          { label: "Reseñas logradas",value: stats.rewarded,   icon: Gift,        color: "text-amber-600 bg-amber-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Configuración de códigos</h2>

        {/* Enable/disable toggle */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <p className="font-medium text-gray-800">Activar códigos de descuento</p>
            <p className="text-sm text-gray-400">
              Se incluirá un código en el mensaje de incentivo cuando detectemos una valoración positiva
            </p>
          </div>
          <button
            onClick={() => setCodeEnabled((v) => !v)}
            className="shrink-0 ml-4"
            aria-label="Toggle códigos"
          >
            {codeEnabled
              ? <ToggleRight className="w-10 h-10 text-brand-600" />
              : <ToggleLeft  className="w-10 h-10 text-gray-300"  />}
          </button>
        </div>

        {/* Code type selector */}
        <div className="pt-5 space-y-3">
          <p className="text-sm font-medium text-gray-700">Tipo de código</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                value: "random" as IncentiveCodeType,
                icon: Shuffle,
                title: "Aleatorio",
                desc: "Se genera un código único por cada cliente. Letras mayúsculas y números.",
              },
              {
                value: "pool" as IncentiveCodeType,
                icon: ListOrdered,
                title: "Pool de códigos",
                desc: "Usa una lista de códigos que tú introduces. Cada código se usa una sola vez.",
              },
            ].map(({ value, icon: Icon, title, desc }) => (
              <button
                key={value}
                onClick={() => setCodeType(value)}
                className={`text-left p-4 rounded-xl border-2 transition ${
                  codeType === value
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${codeType === value ? "text-brand-600" : "text-gray-400"}`} />
                  <span className={`font-semibold text-sm ${codeType === value ? "text-brand-700" : "text-gray-700"}`}>
                    {title}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-snug">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={saveSettings}
            disabled={savingSettings}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm"
          >
            {savingSettings ? "Guardando..." : "Guardar configuración"}
          </button>
          {settingsSuccess && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Guardado
            </span>
          )}
        </div>
      </div>

      {/* Pool upload section */}
      {codeType === "pool" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Subir códigos</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Sube un archivo Excel (.xlsx) o CSV con un código por fila en la primera columna
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium px-4 py-2.5 rounded-lg transition text-sm disabled:opacity-60"
            >
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Subiendo..." : "Subir archivo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {uploadResult && (
            <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {uploadResult}
            </div>
          )}
          {uploadError && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
              {uploadError}
            </div>
          )}
        </div>
      )}

      {/* Codes table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Códigos {codes.length > 0 && <span className="text-gray-400 font-normal text-sm ml-1">({codes.length})</span>}
          </h2>

          {/* Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterStatus)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-300"
            >
              <option value="all">Todos</option>
              <option value="available">Disponibles</option>
              <option value="used">Enviados</option>
              <option value="expired">Expirados</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {filteredCodes.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {codes.length === 0
                ? codeType === "pool"
                  ? "Aún no has subido ningún código. Sube un archivo para empezar."
                  : "Los códigos aleatorios aparecerán aquí cuando se envíen a clientes."
                : "No hay códigos con este filtro."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Código</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Tipo</th>
                  <th className="text-left px-5 py-3 font-medium">Estado</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Enviado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5 font-mono font-semibold text-gray-900 tracking-wider">
                      {code.code}
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        code.type === "random"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {code.type === "random" ? "Aleatorio" : "Pool"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABEL[code.status]?.color ?? ""}`}>
                        {STATUS_LABEL[code.status]?.label ?? code.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 hidden md:table-cell">
                      {code.used_at
                        ? new Date(code.used_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
