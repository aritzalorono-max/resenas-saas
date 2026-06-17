export const CATEGORY_COLORS: Record<string, string> = {
  "Google Maps":  "bg-blue-50 text-blue-700",
  // ES
  "Estrategia":   "bg-purple-50 text-purple-700",
  "Reputación":   "bg-red-50 text-red-700",
  "SEO Local":    "bg-green-50 text-green-700",
  "Legal":        "bg-gray-100 text-gray-700",
  // EN
  "Strategy":     "bg-purple-50 text-purple-700",
  "Reputation":   "bg-red-50 text-red-700",
  "Local SEO":    "bg-green-50 text-green-700",
  // FR
  "Stratégie":    "bg-purple-50 text-purple-700",
  "Réputation":   "bg-red-50 text-red-700",
  "Légal":        "bg-gray-100 text-gray-700",
  // DE
  "Strategie":    "bg-purple-50 text-purple-700",
  "Lokales SEO":  "bg-green-50 text-green-700",
  "Rechtliches":  "bg-gray-100 text-gray-700",
  // IT
  "Strategia":    "bg-purple-50 text-purple-700",
  "Reputazione":  "bg-red-50 text-red-700",
  "SEO Locale":   "bg-green-50 text-green-700",
  "Legale":       "bg-gray-100 text-gray-700",
  // PT
  "Estratégia":   "bg-purple-50 text-purple-700",
  "Reputação":    "bg-red-50 text-red-700",
};

export const LOCALE_DATE_FORMAT: Record<string, string> = {
  es: "es-ES",
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
};

export function formatPostDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(LOCALE_DATE_FORMAT[locale] ?? "en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export const BREADCRUMB_HOME: Record<string, string> = {
  es: "Inicio", en: "Home", fr: "Accueil", de: "Startseite", it: "Home", pt: "Início",
};
