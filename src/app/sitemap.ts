import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog-posts-data";
import { localizedPath } from "@/lib/localized-paths";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";
const LOCALES = ["es", "en", "fr", "de", "it", "pt"] as const;
const DEFAULT_LOCALE = "es";

function sitemapUrl(locale: string, internalPath: string): string {
  const ext = localizedPath(internalPath, locale);
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${APP_URL}${prefix}${ext}`;
}

function alternates(internalPath: string): Record<string, string> {
  const alts: Record<string, string> = {};
  for (const locale of LOCALES) {
    alts[locale] = sitemapUrl(locale, internalPath);
  }
  alts["x-default"] = sitemapUrl(DEFAULT_LOCALE, internalPath);
  return alts;
}

type Frequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function entry(
  internalPath: string,
  opts: { lastModified?: Date; changeFrequency?: Frequency; priority?: number } = {}
): MetadataRoute.Sitemap[number][] {
  const { lastModified = new Date("2026-05-29"), changeFrequency = "monthly", priority = 0.7 } = opts;
  return LOCALES.map((locale) => ({
    url: sitemapUrl(locale, internalPath),
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
