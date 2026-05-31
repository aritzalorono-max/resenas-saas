import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog-posts-data";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";
const LOCALES = ["es", "en", "fr", "de", "it", "pt"] as const;
const DEFAULT_LOCALE = "es";

// Locale-specific external paths for routes that differ across languages
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

function externalPath(locale: string, internalPath: string): string {
  return LOCALIZED_PATHS[internalPath]?.[locale] ?? internalPath;
}

function localePath(locale: string, internalPath: string): string {
  const ext = externalPath(locale, internalPath);
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${APP_URL}${prefix}${ext}`;
}

function alternates(internalPath: string): Record<string, string> {
  const alts: Record<string, string> = {};
  for (const locale of LOCALES) {
    alts[locale] = localePath(locale, internalPath);
  }
  alts["x-default"] = localePath(DEFAULT_LOCALE, internalPath);
  return alts;
}

type Frequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function entry(
  internalPath: string,
  opts: { lastModified?: Date; changeFrequency?: Frequency; priority?: number } = {}
): MetadataRoute.Sitemap[number][] {
  const { lastModified = new Date("2026-05-29"), changeFrequency = "monthly", priority = 0.7 } = opts;
  return LOCALES.map((locale) => ({
    url: localePath(locale, internalPath),
    lastModified,
    changeFrequency,
    priority: locale === DEFAULT_LOCALE ? priority : priority * 0.9,
    alternates: { languages: alternates(internalPath) },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = getBlogPosts("es").flatMap((post) =>
    entry(`/blog/${post.slug}`, {
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [
    ...entry("/", { changeFrequency: "weekly", priority: 1 }),
    ...entry("/casos-exito", { changeFrequency: "monthly", priority: 0.85 }),
    ...entry("/blog", { changeFrequency: "weekly", priority: 0.85 }),
    ...blogEntries,
    ...entry("/faq", { changeFrequency: "monthly", priority: 0.8 }),
    ...entry("/contacto", { changeFrequency: "monthly", priority: 0.6 }),
    ...entry("/register", { changeFrequency: "monthly", priority: 0.7 }),
    ...entry("/login", { changeFrequency: "monthly", priority: 0.5 }),
    ...entry("/terminos", { changeFrequency: "yearly", priority: 0.3 }),
    ...entry("/privacidad", { changeFrequency: "yearly", priority: 0.3 }),
    ...entry("/cookies", { changeFrequency: "yearly", priority: 0.2 }),
  ];
}
