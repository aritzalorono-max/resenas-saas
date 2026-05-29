import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-posts";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";
const LOCALES = ["es", "en", "fr", "de", "it", "pt"] as const;
const DEFAULT_LOCALE = "es";

function localePath(locale: string, path: string) {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${APP_URL}${prefix}${path}`;
}

function alternates(path: string): Record<string, string> {
  const alts: Record<string, string> = {};
  for (const locale of LOCALES) {
    alts[locale] = localePath(locale, path);
  }
  alts["x-default"] = localePath(DEFAULT_LOCALE, path);
  return alts;
}

type Frequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function entry(
  path: string,
  opts: { lastModified?: Date; changeFrequency?: Frequency; priority?: number } = {}
): MetadataRoute.Sitemap[number][] {
  const { lastModified = new Date("2026-05-29"), changeFrequency = "monthly", priority = 0.7 } = opts;
  // Spanish (default) page + all other locales
  return LOCALES.map((locale) => ({
    url: localePath(locale, path),
    lastModified,
    changeFrequency,
    priority: locale === DEFAULT_LOCALE ? priority : priority * 0.9,
    alternates: { languages: alternates(path) },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = blogPosts.flatMap((post) =>
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
