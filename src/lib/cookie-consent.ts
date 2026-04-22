/**
 * Gestión del consentimiento de cookies (RGPD / LSSICE).
 *
 * Versión: cada vez que añadimos una categoría nueva o un servicio nuevo
 * con cookies propias, incrementamos CONSENT_VERSION. Cualquier consentimiento
 * almacenado con una versión anterior se considera inválido y el banner
 * vuelve a mostrarse para pedir nuevas preferencias.
 *
 * Historial de versiones:
 *  1.0  — Lanzamiento inicial. Cookies necesarias (Supabase auth).
 *  1.1  — (pendiente) Analítica (Vercel Analytics / Google Analytics).
 *  1.2  — (pendiente) Marketing y RRSS (Meta Pixel, LinkedIn, etc.).
 */

export const CONSENT_VERSION = "1.0";
const STORAGE_KEY = "ry_cookie_consent";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
}

export interface StoredConsent extends ConsentPreferences {
  version: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Lectura / escritura
// ---------------------------------------------------------------------------

export function getStoredConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredConsent;
  } catch {
    return null;
  }
}

export function saveConsent(prefs: ConsentPreferences): void {
  const consent: StoredConsent = {
    ...prefs,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

export function clearConsent(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Devuelve true si existe un consentimiento válido para la versión actual.
 * Si la versión almacenada es anterior, se considera caduco.
 */
export function hasValidConsent(): boolean {
  const stored = getStoredConsent();
  return stored !== null && stored.version === CONSENT_VERSION;
}

export const ACCEPT_ALL: ConsentPreferences = { analytics: true, marketing: true };
export const REJECT_ALL: ConsentPreferences = { analytics: false, marketing: false };

// ---------------------------------------------------------------------------
// Descripción de categorías (usada en el banner y en la política)
// ---------------------------------------------------------------------------

export interface CookieCategory {
  id: keyof ConsentPreferences;
  label: string;
  description: string;
  examples: string[];
  required: false;
}

export interface RequiredCategory {
  id: "necessary";
  label: string;
  description: string;
  examples: string[];
  required: true;
}

export const COOKIE_CATEGORIES: (RequiredCategory | CookieCategory)[] = [
  {
    id: "necessary",
    label: "Estrictamente necesarias",
    description:
      "Imprescindibles para el funcionamiento de la plataforma. Sin ellas, no es posible iniciar sesión ni garantizar la seguridad de tu cuenta.",
    examples: ["Sesión de usuario (Supabase)", "Protección CSRF", "Preferencias de consentimiento"],
    required: true,
  },
  {
    id: "analytics",
    label: "Analíticas",
    description:
      "Nos ayudan a entender cómo se usa la plataforma para mejorarla. Los datos se tratan de forma agregada y anónima.",
    examples: ["Vercel Analytics", "Google Analytics 4"],
    required: false,
  },
  {
    id: "marketing",
    label: "Marketing y redes sociales",
    description:
      "Permiten mostrar publicidad relevante y medir el rendimiento de campañas en plataformas sociales.",
    examples: ["Meta Pixel (Facebook/Instagram)", "LinkedIn Insight Tag", "Google Ads"],
    required: false,
  },
];
