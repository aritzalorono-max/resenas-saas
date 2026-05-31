import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "fr", "de", "it", "pt"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    // Marketing
    "/casos-exito": {
      es: "/casos-exito",
      en: "/case-studies",
      fr: "/cas-clients",
      de: "/erfolgsgeschichten",
      it: "/casi-di-successo",
      pt: "/casos-de-sucesso",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    // Legal / support
    "/faq": "/faq",
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
    "/cookies": "/cookies",
    // Auth
    "/login": "/login",
    "/register": "/register",
    "/recuperar": "/recuperar",
    "/nueva-contrasena": "/nueva-contrasena",
    // Dashboard (same path for all locales)
    "/dashboard": "/dashboard",
    "/clientes": "/clientes",
    "/resenas": "/resenas",
    "/resenas/[id]": "/resenas/[id]",
    "/configuracion": "/configuracion",
    "/cuenta": "/cuenta",
    "/cartel": "/cartel",
    "/incentivos": "/incentivos",
    "/informes": "/informes",
    "/facturacion": "/facturacion",
    "/onboarding": "/onboarding",
    "/admin": "/admin",
  },
});

export type Locale = (typeof routing.locales)[number];
