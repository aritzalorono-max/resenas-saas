const LOCALIZED_PATHS: Record<string, Partial<Record<string, string>>> = {
  "/casos-exito": {
    es: "/casos-exito",
    en: "/case-studies",
    fr: "/cas-clients",
    de: "/erfolgsgeschichten",
    it: "/casi-di-successo",
    pt: "/casos-de-sucesso",
  },
  "/contacto": {
    es: "/contacto",
    en: "/contact",
    fr: "/contact",
    de: "/kontakt",
    it: "/contatto",
    pt: "/contacto",
  },
  "/privacidad": {
    es: "/privacidad",
    en: "/privacy",
    fr: "/confidentialite",
    de: "/datenschutz",
    it: "/privacy",
    pt: "/privacidade",
  },
  "/terminos": {
    es: "/terminos",
    en: "/terms",
    fr: "/conditions",
    de: "/agb",
    it: "/termini",
    pt: "/termos",
  },
};

export function localizedPath(internalPath: string, locale: string): string {
  return LOCALIZED_PATHS[internalPath]?.[locale] ?? internalPath;
}
