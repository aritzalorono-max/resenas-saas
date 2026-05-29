"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Upload, FileSpreadsheet, Download, X, CheckCircle2, AlertCircle, Loader2, MapPin, Gift, Clock, Tag, ChevronDown, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_WELCOME_MESSAGE } from "@/lib/constants";

interface BusinessSummary {
  businessName: string;
  welcomeMessage: string;
  platformName: string;
  platformUrl: string | null;
  incentiveEnabled: boolean;
  incentiveDescription: string | null;
  incentiveTiming: "initial" | "after_positive";
  codeType: "fixed" | "random" | "pool";
  fixedCode: string | null;
}

interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: "ES", name: "España",           dial: "+34",  flag: "🇪🇸" },
  { code: "MX", name: "México",           dial: "+52",  flag: "🇲🇽" },
  { code: "AR", name: "Argentina",        dial: "+54",  flag: "🇦🇷" },
  { code: "CO", name: "Colombia",         dial: "+57",  flag: "🇨🇴" },
  { code: "CL", name: "Chile",            dial: "+56",  flag: "🇨🇱" },
  { code: "PE", name: "Perú",             dial: "+51",  flag: "🇵🇪" },
  { code: "VE", name: "Venezuela",        dial: "+58",  flag: "🇻🇪" },
  { code: "EC", name: "Ecuador",          dial: "+593", flag: "🇪🇨" },
  { code: "BO", name: "Bolivia",          dial: "+591", flag: "🇧🇴" },
  { code: "PY", name: "Paraguay",         dial: "+595", flag: "🇵🇾" },
  { code: "UY", name: "Uruguay",          dial: "+598", flag: "🇺🇾" },
  { code: "CR", name: "Costa Rica",       dial: "+506", flag: "🇨🇷" },
  { code: "GT", name: "Guatemala",        dial: "+502", flag: "🇬🇹" },
  { code: "PA", name: "Panamá",           dial: "+507", flag: "🇵🇦" },
  { code: "DO", name: "Rep. Dominicana",  dial: "+1",   flag: "🇩🇴" },
  { code: "US", name: "Estados Unidos",   dial: "+1",   flag: "🇺🇸" },
  { code: "GB", name: "Reino Unido",      dial: "+44",  flag: "🇬🇧" },
  { code: "FR", name: "Francia",          dial: "+33",  flag: "🇫🇷" },
  { code: "DE", name: "Alemania",         dial: "+49",  flag: "🇩🇪" },
  { code: "IT", name: "Italia",           dial: "+39",  flag: "🇮🇹" },
  { code: "PT", name: "Portugal",         dial: "+351", flag: "🇵🇹" },
  { code: "BR", name: "Brasil",           dial: "+55",  flag: "🇧🇷" },
  { code: "MA", name: "Marruecos",        dial: "+212", flag: "🇲🇦" },
  { code: "RO", name: "Rumanía",          dial: "+40",  flag: "🇷🇴" },
  { code: "PL", name: "Polonia",          dial: "+48",  flag: "🇵🇱" },
];

const STORAGE_KEY     = "resenas_ya_country";
const DEFAULT_COUNTRY = COUNTRIES[0];
const MAX_RETRIES     = 2;
const RETRY_DELAY_MS  = 1500;
const SEND_DELAY_MS   = 400;
const FETCH_TIMEOUT_MS = 30_000;

// Safeguards for bulk import
const MAX_FILE_SIZE_MB = 10;
const MAX_BULK_ROWS    = 500;

function loadCountry(): Country {
  if (typeof window === "undefined") return DEFAULT_COUNTRY;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = COUNTRIES.find((c) => c.code === saved);
      if (found) return found;
    }
  } catch { /* ignore */ }
  return DEFAULT_COUNTRY;
}

async function sendWithRetry(
  payload: { customer_name: string; customer_phone: string },
  retries = MAX_RETRIES
): Promise<Response> {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch("/api/send-review-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(tid);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw Object.assign(new Error("timeout"), { code: "TIMEOUT" });
    }
    throw err;
  }
  clearTimeout(tid);
  if (!res.ok && res.status >= 500 && retries > 0) {
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    return sendWithRetry(payload, retries - 1);
  }
  return res;
}

// ── Bulk helpers ──────────────────────────────────────────────────────────────

interface BulkRow {
  id: number;
  name: string;
  rawPhone: string;
  phone: string;
  nameError: string | null;
  phoneError: string | null;
}

interface BulkResult {
  success: number;
  errors: { name: string; reason: string }[];
}

function normalizePhone(raw: string, dialCode: string): string {
  const s = String(raw).trim().replace(/[\s\-().]/g, "");
  if (s.startsWith("+")) return s;
  if (s.startsWith("00")) return "+" + s.slice(2);
  return `${dialCode}${s.replace(/^0+/, "")}`;
}

function validateBulkRow(
  name: string,
  phone: string,
  errors: { emptyName: string; tooLong: string; invalidPhone: string }
) {
  const nameError = !name.trim()
    ? errors.emptyName
    : name.trim().length > 100
    ? errors.tooLong
    : null;
  const digits = phone.replace(/\D/g, "");
  const phoneError = digits.length < 6 ? errors.invalidPhone : null;
  return { nameError, phoneError };
}

// Remove diacritics and lowercase for locale-insensitive header matching
function stripDiacritics(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").trim();
}

function findCol(headers: string[], keywords: string[]): number {
  return headers.findIndex((h) => keywords.includes(stripDiacritics(h)));
}

async function parseFileToRows(
  file: File,
  dialCode: string,
  validateFn: (name: string, phone: string) => { nameError: string | null; phoneError: string | null }
): Promise<BulkRow[]> {
  let pairs: [string, string][] = [];

  if (file.name.toLowerCase().endsWith(".csv") || file.name.toLowerCase().endsWith(".txt")) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (!lines.length) return [];
    const sep = lines[0].includes(";") ? ";" : ",";
    const headers = lines[0].split(sep).map((h) => h.replace(/^["']|["']$/g, "").trim());
    const ni = findCol(headers, ["nombre", "name", "cliente", "customer", "customer_name"]);
    const pi = findCol(headers, ["telefono", "phone", "tel", "movil", "whatsapp", "celular", "tlf", "tlfno"]);
    const colN = ni >= 0 ? ni : 0;
    const colP = pi >= 0 ? pi : 1;
    const start = ni >= 0 || pi >= 0 ? 1 : 0;
    pairs = lines.slice(start).map((line) => {
      const cells = line.split(sep).map((c) => c.trim().replace(/^["']|["']$/g, ""));
      return [cells[colN] ?? "", cells[colP] ?? ""];
    });
  } else {
    // XLSX — dynamic import so it only loads when used
    const XLSX = await import("xlsx");
    const ab = await file.arrayBuffer();
    const wb = XLSX.read(ab);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, raw: false, defval: "" });
    if (!raw.length) return [];
    const firstRow = raw[0].map((c) => String(c));
    const ni = findCol(firstRow, ["nombre", "name", "cliente", "customer", "customer_name"]);
    const pi = findCol(firstRow, ["telefono", "phone", "tel", "movil", "whatsapp", "celular", "tlf", "tlfno"]);
    const colN = ni >= 0 ? ni : 0;
    const colP = pi >= 0 ? pi : 1;
    const start = ni >= 0 || pi >= 0 ? 1 : 0;
    pairs = raw.slice(start).map((row) => [String(row[colN] ?? ""), String(row[colP] ?? "")]);
  }

  return pairs
    .filter(([n, p]) => n || p)
    .map(([n, p], idx) => {
      const phone = normalizePhone(p, dialCode);
      const { nameError, phoneError } = validateFn(n.trim(), phone);
      return { id: idx, name: n.trim(), rawPhone: p, phone, nameError, phoneError };
    });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClientesPage() {
  const router = useRouter();
  const t = useTranslations("clientes");

  // Business summary
  const [bizSummary, setBizSummary] = useState<BusinessSummary | null>(null);

  useEffect(() => {
    async function loadBiz() {
      const supabase = createClient();
      const { data: biz } = await supabase
        .from("businesses")
        .select("name, welcome_message, google_maps_url, review_links, incentive_enabled, incentive_description, incentive_timing, incentive_code_type, incentive_fixed_code")
        .single();
      if (!biz) return;
      const links: { name: string; url: string }[] = biz.review_links ?? [];
      const active = links.find((l) => l.url === biz.google_maps_url);
      setBizSummary({
        businessName: biz.name ?? "",
        welcomeMessage: biz.welcome_message ?? DEFAULT_WELCOME_MESSAGE,
        platformName: active?.name ?? (biz.google_maps_url ? t("platformConfigured") : t("notConfigured")),
        platformUrl: biz.google_maps_url,
        incentiveEnabled: biz.incentive_enabled ?? false,
        incentiveDescription: biz.incentive_description ?? null,
        incentiveTiming: (biz.incentive_timing as "initial" | "after_positive") ?? "initial",
        codeType: (biz.incentive_code_type as "fixed" | "random" | "pool") ?? "fixed",
        fixedCode: biz.incentive_fixed_code ?? null,
      });
    }
    loadBiz();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationErrors = {
    emptyName: t("validateNameEmpty"),
    tooLong: t("validateNameTooLong"),
    invalidPhone: t("validatePhoneInvalid"),
  };

  const validateRow = (name: string, phone: string) =>
    validateBulkRow(name, phone, validationErrors);

  // Shared
  const [mode, setMode] = useState<"manual" | "bulk">("manual");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);

  // Manual form
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ customer_name: "", customer_phone: "" });
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);

  // Bulk upload
  const [bulkRows, setBulkRows]       = useState<BulkRow[]>([]);
  const [bulkFileName, setBulkFileName] = useState("");
  const [bulkParseError, setBulkParseError] = useState("");
  const [sendStatus, setSendStatus]   = useState<"idle" | "sending" | "done">("idle");
  const [sendProgress, setSendProgress] = useState(0);
  const [sendResult, setSendResult]   = useState<BulkResult | null>(null);
  const [dragOver, setDragOver]       = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setCountry(loadCountry()); }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (dropdownOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [dropdownOpen]);

  function selectCountry(c: Country) {
    setCountry(c);
    localStorage.setItem(STORAGE_KEY, c.code);
    setDropdownOpen(false);
    setSearch("");
    if (bulkRows.length) {
      setBulkRows((rows) =>
        rows.map((r) => {
          const phone = normalizePhone(r.rawPhone, c.dial);
          const { nameError, phoneError } = validateRow(r.name, phone);
          return { ...r, phone, nameError, phoneError };
        })
      );
    }
  }

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  // ── Manual submit ────────────────────────────────────────────────────────────
  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.customer_name.trim()) { setError(t("errorNameRequired")); return; }
    if (form.customer_name.trim().length > 100) { setError(t("errorNameTooLong")); return; }
    const digits = form.customer_phone.replace(/\D/g, "");
    if (!digits || digits.length < 6) { setError(t("errorPhoneInvalid")); return; }

    setLoading(true);
    setRetrying(false);
    const fullPhone = `${country.dial}${digits}`;
    const retryTimer = setTimeout(() => setRetrying(true), RETRY_DELAY_MS + 200);

    try {
      const res = await sendWithRetry({ customer_name: form.customer_name.trim(), customer_phone: fullPhone });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t("errorSend")); return; }
      setSuccess(true);
      setForm({ customer_name: "", customer_phone: "" });
    } catch (err) {
      const isTimeout = err instanceof Error && (err as { code?: string }).code === "TIMEOUT";
      setError(isTimeout ? t("errorTimeout") : t("errorConnection"));
    } finally {
      clearTimeout(retryTimer);
      setLoading(false);
      setRetrying(false);
    }
  }

  // ── Bulk handlers ────────────────────────────────────────────────────────────
  async function handleFileSelect(file: File) {
    setBulkParseError("");
    setSendResult(null);
    setSendStatus("idle");
    setSendProgress(0);
    setBulkFileName(file.name);

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setBulkParseError(t("errorFileTooLarge", { max: MAX_FILE_SIZE_MB }));
      return;
    }

    try {
      const rows = await parseFileToRows(file, country.dial, validateRow);
      if (!rows.length) {
        setBulkParseError(t("errorFileEmpty"));
        setBulkRows([]);
        return;
      }
      if (rows.length > MAX_BULK_ROWS) {
        setBulkParseError(t("errorFileTooManyRows", { rows: rows.length, max: MAX_BULK_ROWS }));
        setBulkRows([]);
        return;
      }
      setBulkRows(rows);
    } catch (err) {
      setBulkParseError(t("errorFileRead"));
      setBulkRows([]);
      console.error("Bulk file read error:", err);
    }
  }

  function clearBulkFile() {
    setBulkRows([]);
    setBulkFileName("");
    setBulkParseError("");
    setSendResult(null);
    setSendStatus("idle");
    setSendProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleBulkSend() {
    const valid = bulkRows.filter((r) => !r.nameError && !r.phoneError);
    if (!valid.length) return;
    setSendStatus("sending");
    setSendProgress(0);
    const result: BulkResult = { success: 0, errors: [] };

    for (let i = 0; i < valid.length; i++) {
      const row = valid[i];
      try {
        const res = await sendWithRetry({ customer_name: row.name, customer_phone: row.phone });
        if (res.ok) {
          result.success++;
        } else {
          const data = await res.json().catch(() => ({}));
          result.errors.push({ name: row.name, reason: data.error ?? `Error ${res.status}` });
        }
      } catch (err) {
        const isTimeout = err instanceof Error && (err as { code?: string }).code === "TIMEOUT";
        result.errors.push({ name: row.name, reason: isTimeout ? t("errorTimeout") : t("errorConnection") });
      }
      setSendProgress(i + 1);
      if (i < valid.length - 1) await new Promise((r) => setTimeout(r, SEND_DELAY_MS));
    }

    setSendResult(result);
    setSendStatus("done");
  }

  const validCount   = bulkRows.filter((r) => !r.nameError && !r.phoneError).length;
  const invalidCount = bulkRows.length - validCount;

  return (
    <div className="max-w-lg animate-fade-in">
      <div className="mb-5 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {t("subtitle")}
        </p>
      </div>

      {/* ── Mode tabs ─────────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-5">
        {(["manual", "bulk"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "manual" ? t("manualBtn") : t("bulkBtn")}
          </button>
        ))}
      </div>

      {mode === "manual" ? (
        /* ── Manual form ───────────────────────────────────────────────────── */
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-card">
          {success ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t("successTitle")}</h2>
              <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">
                {t("successDesc", { name: form.customer_name.trim() || "el cliente" })}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSuccess(false)}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 active:bg-brand-800
                             text-white font-semibold py-3.5 rounded-xl transition text-base"
                >
                  {t("sendAnother")}
                </button>
                <button
                  onClick={() => router.push("/resenas")}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold
                             py-3.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition text-base"
                >
                  {t("viewReviews")}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-5">
              <div>
                <label htmlFor="customer_name" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("name")}
                </label>
                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => setForm((p) => ({ ...p, customer_name: e.target.value }))}
                  required
                  disabled={loading}
                  autoComplete="off"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl
                             focus:ring-2 focus:ring-brand-500 focus:border-transparent
                             outline-none transition text-base disabled:opacity-60 disabled:bg-gray-50"
                  placeholder={t("namePlaceholder")}
                />
              </div>

              <div>
                <label htmlFor="customer_phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("phone")}
                </label>
                <div className={`flex rounded-xl border overflow-visible transition
                  ${loading ? "border-gray-200 opacity-60" : "border-gray-300 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent"}`}>
                  <div ref={dropdownRef} className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => !loading && setDropdownOpen((o) => !o)}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-3 py-3.5 bg-gray-50 hover:bg-gray-100
                                 active:bg-gray-200 border-r border-gray-300 rounded-l-xl
                                 transition h-full text-sm font-medium text-gray-700 whitespace-nowrap
                                 min-w-[80px] justify-center disabled:cursor-not-allowed"
                      aria-label={t("country")}
                    >
                      <span className="text-xl leading-none">{country.flag}</span>
                      <span className="text-gray-500 text-xs">{country.dial}</span>
                      <svg
                        className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute left-0 top-full mt-1 w-64 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="p-2 border-b border-gray-100">
                          <input
                            ref={searchRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("searchCountry")}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-400"
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto">
                          {filteredCountries.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">{t("noResults")}</p>
                          ) : (
                            filteredCountries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => selectCountry(c)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-brand-50 transition text-left ${
                                  c.code === country.code ? "bg-brand-50 font-semibold text-brand-700" : "text-gray-700"
                                }`}
                              >
                                <span className="text-lg">{c.flag}</span>
                                <span className="flex-1 truncate">{c.name}</span>
                                <span className="text-gray-400 text-xs">{c.dial}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    id="customer_phone"
                    name="customer_phone"
                    type="tel"
                    inputMode="numeric"
                    value={form.customer_phone}
                    onChange={(e) => setForm((p) => ({ ...p, customer_phone: e.target.value }))}
                    required
                    disabled={loading}
                    className="flex-1 px-4 py-3.5 outline-none text-base rounded-r-xl bg-white min-w-0 disabled:bg-gray-50"
                    placeholder="612 345 678"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {t("phoneHint", { dial: country.dial })}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Message preview */}
              {bizSummary && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPreviewOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      {t("preview")}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${previewOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {previewOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-[#f0f2f5]">
                      <div className="bg-[#dcf8c6] rounded-xl rounded-tl-none px-3.5 py-2.5 text-sm text-gray-800 whitespace-pre-wrap mt-3 shadow-sm max-w-[85%]">
                        {(bizSummary.welcomeMessage || DEFAULT_WELCOME_MESSAGE)
                          .replace(/\{nombre\}/g, form.customer_name.trim() || "el cliente")
                          .replace(/\{negocio\}/g, bizSummary.businessName || "tu negocio")}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {t.rich("previewFooter", {
                          a: (chunks) => (
                            <a href="/configuracion" className="text-brand-600 hover:underline font-medium">{chunks}</a>
                          ),
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-400 leading-relaxed">
                {t("gdprConsent")}
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800
                           disabled:opacity-70 text-white font-bold py-4 rounded-xl
                           transition text-base flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {retrying ? t("retrying") : t("submitting")}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {t("submit")}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      ) : (
        /* ── Bulk upload ───────────────────────────────────────────────────── */
        <div className="space-y-4">

          {/* Drop zone / file selector */}
          {!bulkFileName ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFileSelect(file);
              }}
              className={`bg-white border-2 border-dashed rounded-2xl p-8 text-center transition
                ${dragOver ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-gray-400" strokeWidth={1.75} />
              </div>
              <p className="font-semibold text-gray-700 mb-1">{t("dropZoneTitle")}</p>
              <p className="text-sm text-gray-400 mb-4">{t("dropZoneDesc")}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  {t("bulkBtn")}
                </button>
                <a
                  href="/plantilla-resenasya.csv"
                  download
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition"
                >
                  <Download className="w-4 h-4" strokeWidth={1.75} />
                  {t("downloadTemplate")}
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                {t("templateHint")}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,.txt"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>
          ) : (
            /* File loaded — preview table */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
              {/* File header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                <div className="flex items-center gap-2 min-w-0">
                  <FileSpreadsheet className="w-4 h-4 text-brand-600 shrink-0" strokeWidth={1.75} />
                  <span className="text-sm font-medium text-gray-700 truncate">{bulkFileName}</span>
                  {bulkRows.length > 0 && (
                    <span className="text-xs text-gray-400 shrink-0">{t("bulkRowsCount", { count: bulkRows.length })}</span>
                  )}
                </div>
                <button
                  onClick={clearBulkFile}
                  className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
                  aria-label={t("removeFile")}
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>

              {bulkParseError ? (
                <div className="px-4 py-8 text-center">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" strokeWidth={1.75} />
                  <p className="text-sm text-red-600 font-medium">{bulkParseError}</p>
                </div>
              ) : (
                <>
                  {/* Stats */}
                  <div className="flex items-center gap-4 px-4 py-2.5 border-b border-gray-100 text-xs font-medium">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                      {t("bulkValid", { count: validCount })}
                    </span>
                    {invalidCount > 0 && (
                      <span className="flex items-center gap-1 text-red-500">
                        <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
                        {t("bulkInvalidCount", { count: invalidCount })}
                      </span>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left px-4 py-2 text-gray-400 font-medium w-8">#</th>
                          <th className="text-left px-4 py-2 text-gray-500 font-medium">{t("colName")}</th>
                          <th className="text-left px-4 py-2 text-gray-500 font-medium">{t("colPhone")}</th>
                          <th className="px-4 py-2 w-6"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {bulkRows.map((row) => {
                          const hasError = row.nameError || row.phoneError;
                          return (
                            <tr key={row.id} className={hasError ? "bg-red-50/40" : ""}>
                              <td className="px-4 py-2 text-gray-300">{row.id + 1}</td>
                              <td className="px-4 py-2">
                                <span className={row.nameError ? "text-red-600" : "text-gray-700"}>
                                  {row.name || <span className="italic text-gray-300">{t("emptyCell")}</span>}
                                </span>
                                {row.nameError && (
                                  <span className="block text-red-400 text-[10px]">{row.nameError}</span>
                                )}
                              </td>
                              <td className="px-4 py-2 font-mono">
                                <span className={row.phoneError ? "text-red-600" : "text-gray-600"}>
                                  {row.phone || <span className="italic text-gray-300 font-sans">{t("emptyCell")}</span>}
                                </span>
                                {row.phoneError && (
                                  <span className="block text-red-400 text-[10px] font-sans">{row.phoneError}</span>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {hasError
                                  ? <AlertCircle className="w-3.5 h-3.5 text-red-400" strokeWidth={2} />
                                  : <CheckCircle2 className="w-3.5 h-3.5 text-green-500" strokeWidth={2} />
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Country prefix selector */}
          {bulkRows.length > 0 && sendStatus === "idle" && (
            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 shadow-card flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium shrink-0">{t("defaultPrefix")}</span>
              <select
                value={country.code}
                onChange={(e) => {
                  const found = COUNTRIES.find((c) => c.code === e.target.value);
                  if (found) selectCountry(found);
                }}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.dial})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 hidden sm:block">{t("prefixHint")}</p>
            </div>
          )}

          {/* Progress */}
          {sendStatus === "sending" && (
            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600" strokeWidth={2} />
                  {t("sendingProgress", { current: sendProgress, total: validCount })}
                </span>
                <span className="text-xs text-gray-400 tabular-nums">
                  {Math.round((sendProgress / validCount) * 100)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${(sendProgress / validCount) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">{t("sendingWarning")}</p>
            </div>
          )}

          {/* Results */}
          {sendStatus === "done" && sendResult && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-5 text-sm font-medium">
                <span className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                  {t("resultSent", { count: sendResult.success })}
                </span>
                {sendResult.errors.length > 0 && (
                  <span className="flex items-center gap-1.5 text-red-500">
                    <AlertCircle className="w-4 h-4" strokeWidth={2} />
                    {t("bulkInvalidCount", { count: sendResult.errors.length })}
                  </span>
                )}
              </div>
              {sendResult.errors.length > 0 && (
                <div className="px-4 py-3 space-y-1.5 max-h-40 overflow-y-auto border-b border-gray-100">
                  {sendResult.errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-600">
                      <span className="font-medium">{e.name}:</span> {e.reason}
                    </p>
                  ))}
                </div>
              )}
              <div className="px-4 py-3 bg-gray-50 flex gap-3">
                <button
                  onClick={clearBulkFile}
                  className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-100 transition"
                >
                  {t("importAnother")}
                </button>
                <button
                  onClick={() => router.push("/resenas")}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-xl transition"
                >
                  {t("viewReviewsArrow")}
                </button>
              </div>
            </div>
          )}

          {/* Send button */}
          {bulkRows.length > 0 && sendStatus === "idle" && validCount > 0 && (
            <>
              <p className="text-xs text-gray-400 leading-relaxed px-1">
                {t("gdprConsentBulk")}
              </p>
              <button
                onClick={handleBulkSend}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl
                           transition text-base flex items-center justify-center gap-2 shadow-md shadow-brand-200"
              >
                <Upload className="w-5 h-5" strokeWidth={2} />
                {t("bulkSendBtn", { count: validCount })}
                {invalidCount > 0 && (
                  <span className="text-brand-200 font-normal text-sm ml-1">
                    {t("bulkSkipped", { count: invalidCount })}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      )}

      {/* Active config summary */}
      {bizSummary && (
        <div className="mt-5 bg-white border border-gray-200 rounded-2xl p-4 space-y-2.5">
          <h3 className="font-semibold text-gray-800 text-sm">{t("activeConfig")}</h3>
          <div className="space-y-2">

            {/* Platform */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" strokeWidth={1.75} />
              <div className="text-sm">
                <span className="text-gray-500">{t("platformLabel")}: </span>
                {bizSummary.platformUrl
                  ? <span className="font-medium text-gray-900">{bizSummary.platformName}</span>
                  : <a href="/configuracion" className="text-amber-600 font-medium hover:underline">{t("notConfigured")}</a>}
              </div>
            </div>

            {/* Incentive */}
            <div className="flex items-start gap-2.5">
              <Gift className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" strokeWidth={1.75} />
              <div className="text-sm">
                <span className="text-gray-500">{t("incentiveLabel")}: </span>
                {bizSummary.incentiveEnabled && bizSummary.incentiveDescription
                  ? <span className="font-medium text-gray-900">{bizSummary.incentiveDescription}</span>
                  : <span className="text-gray-400">{t("incentiveOff")}</span>}
              </div>
            </div>

            {/* Timing — only if incentive active */}
            {bizSummary.incentiveEnabled && bizSummary.incentiveDescription && (
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" strokeWidth={1.75} />
                <div className="text-sm">
                  <span className="text-gray-500">{t("timingLabel")}: </span>
                  <span className="font-medium text-gray-900">
                    {bizSummary.incentiveTiming === "initial"
                      ? t("timingInitial")
                      : t("timingAfterPositive")}
                  </span>
                </div>
              </div>
            )}

            {/* Code — only if incentive active */}
            {bizSummary.incentiveEnabled && bizSummary.incentiveDescription && (
              <div className="flex items-start gap-2.5">
                <Tag className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" strokeWidth={1.75} />
                <div className="text-sm">
                  <span className="text-gray-500">{t("codeLabel")}: </span>
                  {bizSummary.codeType === "fixed" && bizSummary.fixedCode
                    ? <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">{bizSummary.fixedCode}</span>
                    : bizSummary.codeType === "fixed"
                    ? <span className="text-gray-400">{t("codeNone")}</span>
                    : bizSummary.codeType === "random"
                    ? <span className="font-medium text-gray-900">{t("codeRandom")}</span>
                    : <span className="font-medium text-gray-900">{t("codePool")}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2 text-sm">{t("howTitle")}</h3>
        <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
          <li>{t("howStep1")}</li>
          <li>{t("howStep2")}</li>
          <li>{t("howStep3")}</li>
          <li>{t("howStep4")}</li>
        </ol>
      </div>
    </div>
  );
}
