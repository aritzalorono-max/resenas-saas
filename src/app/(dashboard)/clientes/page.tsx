"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
  const res = await fetch("/api/send-review-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Solo reintenta en errores de servidor (5xx), no en errores de cliente (4xx)
  if (!res.ok && res.status >= 500 && retries > 0) {
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    return sendWithRetry(payload, retries - 1);
  }
  return res;
}

export default function ClientesPage() {
  const router = useRouter();
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ customer_name: "", customer_phone: "" });
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);

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
  }

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.customer_name.trim()) {
      setError("El nombre del cliente es obligatorio");
      return;
    }
    if (form.customer_name.trim().length > 100) {
      setError("El nombre no puede superar los 100 caracteres");
      return;
    }
    const digits = form.customer_phone.replace(/\D/g, "");
    if (!digits || digits.length < 6) {
      setError("Introduce un número de teléfono válido");
      return;
    }

    setLoading(true);
    setRetrying(false);

    const fullPhone = `${country.dial}${digits}`;

    // Simula el estado de "reintentando" después del primer intento fallido
    const retryTimer = setTimeout(() => {
      setRetrying(true);
    }, RETRY_DELAY_MS + 200);

    try {
      const res = await sendWithRetry({
        customer_name: form.customer_name.trim(),
        customer_phone: fullPhone,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al enviar la solicitud");
        return;
      }

      setSuccess(true);
      setForm({ customer_name: "", customer_phone: "" });
    } catch {
      setError("Error de conexión. Comprueba tu conexión a internet e inténtalo de nuevo.");
    } finally {
      clearTimeout(retryTimer);
      setLoading(false);
      setRetrying(false);
    }
  }

  return (
    <div className="max-w-lg animate-fade-in">
      <div className="mb-5 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Enviar solicitud de reseña</h1>
        <p className="text-gray-400 text-sm mt-1">
          Introduce los datos del cliente para enviarle un WhatsApp
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-card">
        {success ? (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡WhatsApp enviado!</h2>
            <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">
              El cliente recibirá el mensaje en su WhatsApp en breve.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setSuccess(false)}
                className="flex-1 bg-brand-600 hover:bg-brand-700 active:bg-brand-800
                           text-white font-semibold py-3.5 rounded-xl transition text-base"
              >
                Enviar otro
              </button>
              <button
                onClick={() => router.push("/resenas")}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold
                           py-3.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition text-base"
              >
                Ver reseñas
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del cliente
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
                placeholder="Ej: María García"
              />
            </div>

            <div>
              <label htmlFor="customer_phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono (WhatsApp)
              </label>

              <div className={`flex rounded-xl border overflow-visible transition
                ${loading ? "border-gray-200 opacity-60" : "border-gray-300 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent"}`}>
                {/* Country selector */}
                <div ref={dropdownRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => !loading && setDropdownOpen((o) => !o)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-3.5 bg-gray-50 hover:bg-gray-100
                               active:bg-gray-200 border-r border-gray-300 rounded-l-xl
                               transition h-full text-sm font-medium text-gray-700 whitespace-nowrap
                               min-w-[80px] justify-center disabled:cursor-not-allowed"
                    aria-label="Seleccionar país"
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
                    <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          ref={searchRef}
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Buscar país o prefijo..."
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-400"
                        />
                      </div>
                      <div className="max-h-56 overflow-y-auto">
                        {filteredCountries.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-4">Sin resultados</p>
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

                {/* Phone input */}
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
                {country.flag} {country.dial} — número local sin prefijo
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
                  {retrying ? "Reintentando envío..." : "Enviando WhatsApp..."}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Enviar por WhatsApp
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2 text-sm">¿Cómo funciona?</h3>
        <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
          <li>Introduces el nombre y teléfono del cliente</li>
          <li>Le llega un WhatsApp pidiendo su opinión</li>
          <li>Si es positiva, la IA le anima a dejar reseña en Google Maps</li>
          <li>Si es negativa, le responde con empatía sin enviarle al enlace</li>
        </ol>
      </div>
    </div>
  );
}
