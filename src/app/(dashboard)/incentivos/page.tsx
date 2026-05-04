"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Gift, Upload, RefreshCw,
  CheckCircle, Clock, Shuffle, ListOrdered,
  ChevronDown, Ticket,
} from "lucide-react";
import type { DiscountCode, IncentiveCodeType, IncentiveTiming } from "@/types";

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
  const [businessId, setBusinessId]           = useState<string | null>(null);
  const [businessName, setBusinessName]       = useState("");
  const [platformName, setPlatformName]       = useState("Google Maps");
  const [incentiveEnabled, setIncentiveEnabled] = useState(false);
  const [incentiveDescription, setIncentiveDescription] = useState("");
  const [timing, setTiming]                   = useState<IncentiveTiming>("initial");
  const [codeType, setCodeType]               = useState<IncentiveCodeType>("fixed");
  const [fixedCode, setFixedCode]             = useState("");
  const [advancedOpen, setAdvancedOpen]       = useState(false);
  const [codes, setCodes]                     = useState<DiscountCode[]>([]);
  const [stats, setStats]                     = useState<Stats>({ total: 0, available: 0, used: 0, rewarded: 0 });
  const [filter, setFilter]                   = useState<FilterStatus>("all");
  const [loading, setLoading]                 = useState(true);
  const [savingSettings, setSavingSettings]   = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [uploading, setUploading]             = useState(false);
  const [uploadResult, setUploadResult]       = useState<string | null>(null);
  const [uploadError, setUploadError]         = useState<string | null>(null);
  const fileInputRef                          = useRef<HTMLInputElement>(null);

  async function load(bId?: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: biz } = await supabase
      .from("businesses")
      .select("id, name, google_maps_url, review_links, incentive_enabled, incentive_description, incentive_code_enabled, incentive_code_type, incentive_fixed_code, incentive_timing")
      .eq("user_id", user.id)
      .single();

    if (!biz) return;
    const id = bId ?? biz.id;
    setBusinessId(id);
    setBusinessName(biz.name ?? "");
    setIncentiveEnabled(biz.incentive_enabled ?? false);
    setIncentiveDescription(biz.incentive_description ?? "");
    setTiming((biz.incentive_timing as IncentiveTiming) ?? "initial");
    setCodeType(biz.incentive_code_type ?? "fixed");
    setFixedCode(biz.incentive_fixed_code ?? "");
    // Always start collapsed regardless of saved type

    // Determine active platform name
    const links: { name: string; url: string }[] = biz.review_links ?? [];
    const active = links.find((l) => l.url === biz.google_maps_url);
    setPlatformName(active?.name ?? "Google Maps");

    // Codes list and rewarded count are independent — run in parallel
    const [{ data: codesData }, { count: rewarded }] = await Promise.all([
      supabase
        .from("discount_codes")
        .select("*")
        .eq("business_id", id)
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("review_requests")
        .select("id", { count: "exact", head: true })
        .eq("business_id", id)
        .not("discount_code", "is", null)
        .eq("status", "rewarded"),
    ]);

    const allCodes = (codesData ?? []) as DiscountCode[];
    setCodes(allCodes);

    const available = allCodes.filter((c) => c.status === "available").length;
    const used      = allCodes.filter((c) => c.status === "used").length;

    setStats({ total: allCodes.length, available, used, rewarded: rewarded ?? 0 });
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function saveSettings() {
    if (!businessId || savingSettings) return;
    setSavingSettings(true);
    setSettingsSuccess(false);
    const supabase = createClient();
    await supabase
      .from("businesses")
      .update({
        incentive_enabled: incentiveEnabled,
        incentive_description: incentiveDescription.trim() || null,
        incentive_timing: timing,
        incentive_code_enabled: codeType === "fixed" ? fixedCode.trim() !== "" : true,
        incentive_code_type: codeType,
        incentive_fixed_code: codeType === "fixed" ? fixedCode.trim() || null : null,
      })
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

      {/* ── Incentivo ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-900">Incentivo por reseña</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Cuando esté activo, el mensaje de WhatsApp incluirá automáticamente la oferta de recompensa
          </p>
        </div>

        {/* Legal disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
          <p className="font-semibold mb-1">Aviso de responsabilidad</p>
          <p>
            Algunas plataformas de reseñas (como Google Maps) tienen políticas propias sobre incentivos y solicitudes
            selectivas. <strong>Eres el único responsable</strong> de asegurarte de que el uso de esta función cumple
            con dichas políticas. ReseñasYa no asume ninguna responsabilidad por sanciones, eliminaciones de reseñas
            u otras consecuencias derivadas de su uso. Consulta los Términos de Servicio de cada plataforma antes
            de activarlo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIncentiveEnabled((v) => !v)}
          className={`flex items-center gap-3 w-full text-left rounded-xl border-2 p-4 transition ${
            incentiveEnabled ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <span className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${incentiveEnabled ? "bg-brand-500" : "bg-gray-300"}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${incentiveEnabled ? "translate-x-5" : "translate-x-1"}`} />
          </span>
          <div>
            <p className={`font-semibold text-sm ${incentiveEnabled ? "text-brand-700" : "text-gray-700"}`}>
              {incentiveEnabled ? "Incentivo activado" : "Incentivo desactivado"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {incentiveEnabled
                ? "El cliente recibirá la oferta de recompensa si deja una reseña"
                : "Actívalo para ofrecer una recompensa a cambio de una reseña"}
            </p>
          </div>
        </button>

        {incentiveEnabled && (
          <div className="space-y-4">
            {/* Cuándo avisar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ¿Cuándo avisar del incentivo?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  {
                    value: "initial" as IncentiveTiming,
                    title: "En el primer mensaje",
                    desc: "El cliente ve la oferta desde el principio, antes de responder.",
                  },
                  {
                    value: "after_positive" as IncentiveTiming,
                    title: "Tras respuesta positiva",
                    desc: "Solo se ofrece si el cliente ya ha expresado una opinión buena.",
                  },
                ] as { value: IncentiveTiming; title: string; desc: string }[]).map(({ value, title, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTiming(value)}
                    className={`text-left p-3 rounded-xl border-2 transition ${timing === value ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
                  >
                    <p className={`font-semibold text-sm mb-0.5 ${timing === value ? "text-brand-700" : "text-gray-700"}`}>{title}</p>
                    <p className="text-xs text-gray-500 leading-snug">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Qué ofreces */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ¿Qué ofreces a cambio? *
              </label>
              <input
                type="text"
                value={incentiveDescription}
                onChange={(e) => setIncentiveDescription(e.target.value)}
                maxLength={200}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
                placeholder="Ej: un código descuento del 25%"
              />
              <p className="text-xs text-gray-400 mt-1">
                Este texto se añade automáticamente al final del primer mensaje de WhatsApp.
              </p>
            </div>

            {/* Código fijo + botón opciones avanzadas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Código de descuento
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={fixedCode}
                  onChange={(e) => setFixedCode(e.target.value.toUpperCase())}
                  disabled={codeType !== "fixed"}
                  maxLength={50}
                  className="flex-1 max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition font-mono tracking-widest uppercase disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder="Ej: BIENVENIDA26"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = !advancedOpen;
                    setAdvancedOpen(next);
                    if (!next) setCodeType("fixed");
                  }}
                  className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-800 font-medium whitespace-nowrap"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                  {advancedOpen ? "Ocultar opciones" : "Más opciones"}
                </button>
              </div>
              {codeType === "fixed" && (
                <p className="text-xs text-gray-400 mt-1">
                  Se enviará el mismo código a todos los clientes. Déjalo vacío para no enviar código.
                </p>
              )}
            </div>

            {/* Opciones avanzadas */}
            {advancedOpen && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Opciones avanzadas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: "random" as IncentiveCodeType, icon: Shuffle, title: "Aleatorio", desc: "Código único por cliente, generado automáticamente." },
                    { value: "pool"   as IncentiveCodeType, icon: ListOrdered, title: "Pool de códigos", desc: "Lista propia de códigos. Cada uno se usa una sola vez." },
                  ].map(({ value, icon: Icon, title, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCodeType(value)}
                      className={`text-left p-3 rounded-xl border-2 transition ${codeType === value ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${codeType === value ? "text-brand-600" : "text-gray-400"}`} />
                        <span className={`font-semibold text-sm ${codeType === value ? "text-brand-700" : "text-gray-700"}`}>{title}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-snug">{desc}</p>
                    </button>
                  ))}
                </div>

                {/* Upload para pool */}
                {codeType === "pool" && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Sube un Excel (.xlsx) o CSV con un código por fila</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-3 py-2 rounded-lg transition text-sm disabled:opacity-60"
                      >
                        {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? "Subiendo..." : "Subir archivo"}
                      </button>
                      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileUpload} />
                    </div>
                    {uploadResult && (
                      <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />{uploadResult}
                      </div>
                    )}
                    {uploadError && (
                      <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{uploadError}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Botón guardar */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={saveSettings}
            disabled={savingSettings}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm"
          >
            {savingSettings ? "Guardando..." : "Guardar cambios"}
          </button>
          {settingsSuccess && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Guardado
            </span>
          )}
        </div>

        {/* Vista previa: flujo completo de conversación */}
        {incentiveEnabled && incentiveDescription && (() => {
          const previewCode =
            codeType === "fixed" ? (fixedCode.trim() || null) :
            codeType === "random" ? "A3K8Z2QP" :
            "TU-CÓDIGO";

          const msgClass = "text-sm text-gray-800 leading-relaxed";
          const biz = businessName || "tu negocio";
          const intro = timing === "initial"
            ? `¡Qué alegría saber eso, María! 🙌 Nos encanta que hayas tenido una gran experiencia en ${biz}.\n\n¿Te animarías a dejarnos una reseña de 5 ⭐ en ${platformName}?\n\n👉 [enlace a ${platformName}]\n\n`
            : `¡Qué alegría saber eso, María! 🙌 Nos encanta que hayas tenido una gran experiencia en ${biz}.\n\n¿Te animarías a dejarnos una reseña de 5 ⭐ en ${platformName}? Es muy sencillo:\n\n👉 [enlace a ${platformName}]\n\n`;

          return (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ejemplo de conversación</p>

              {/* Mensaje 1: inicial del negocio */}
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400 ml-1">1. Mensaje inicial (lo envías tú)</p>
                <div className="bg-[#dcf8c6] rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs self-end ml-auto">
                  <p className={`${msgClass} whitespace-pre-wrap`}>
                    {timing === "initial"
                      ? `Hola María, ¿cómo fue tu experiencia en ${biz}?\n\nRecuerda que si nos puntúas 5 estrellas en ${platformName} y nos envías una captura de pantalla, recibirás de regalo: ${incentiveDescription}.`
                      : `Hola María, ¿cómo fue tu experiencia en ${biz}?`}
                  </p>
                </div>
              </div>

              {/* Respuesta cliente */}
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400 ml-1">2. El cliente responde</p>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                  <p className="text-sm text-gray-700 italic">Muy bien, todo perfecto 😊</p>
                </div>
              </div>

              {/* Mensaje 3: seguimiento automático */}
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400 ml-1">3. Respuesta automática (opinión positiva)</p>
                <div className="bg-[#dcf8c6] rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs self-end ml-auto">
                  <p className={`${msgClass} whitespace-pre-wrap`}>
                    {intro}{"Y como agradecimiento por tu tiempo, tu regalo: "}
                    <strong>{incentiveDescription}</strong>
                    {" 🎁"}
                    {timing === "initial"
                      ? "\n\nCuando la publiques, mándanos una captura de pantalla y te lo enviamos enseguida. ¡Muchas gracias! 💚"
                      : "\n\nCuando publiques tu reseña de 5 estrellas, mándanos una captura de pantalla y te lo enviamos enseguida. ¡Muchas gracias! 💚"}
                  </p>
                </div>
              </div>

              {/* Mensaje 4: tras recibir captura */}
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400 ml-1">4. Cliente envía captura → confirmación automática</p>
                <div className="bg-[#dcf8c6] rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs self-end ml-auto">
                  <p className={`${msgClass} whitespace-pre-wrap`}>
                    {`¡Muchísimas gracias, María! 🎉 Hemos comprobado tu reseña de 5 ⭐ en ${platformName}.\n\nComo prometimos, aquí tienes tu regalo: `}
                    <strong>{incentiveDescription}</strong>
                    {previewCode && <>{" — código "}<strong className="bg-white/60 px-1 rounded">{previewCode}</strong></>}
                    {` 🎁\n\n¡Gracias por confiar en ${biz}! 💚`}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

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
