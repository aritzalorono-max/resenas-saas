/**
 * SEO helpers: canonical URLs, hreflang alternates.
 *
 * Use hreflangAlternates(internalPath) for static pages and
 * blogHreflangAlternates(slugsByLocale) for blog posts where
 * each locale has a different URL slug.
 */

import { localizedPath } from "@/lib/localized-paths";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";

const LOCALES = ["es", "en", "fr", "de", "it", "pt"] as const;

/** Absolute URL for an internal path + locale (handles localized path segments). */
export function buildUrl(internalPath: string, locale: string): string {
  const path = localizedPath(internalPath, locale);
  const prefix = locale === "es" ? "" : `/${locale}`;
  return `${APP_URL}${prefix}${path}`;
}

/**
 * Returns the `alternates.languages` map for Next.js Metadata.
 * Adds a `<link rel="alternate" hreflang="…">` for every locale.
 */
export function hreflangAlternates(internalPath: string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const locale of LOCALES) {
    langs[locale] = buildUrl(internalPath, locale);
  }
  langs["x-default"] = buildUrl(internalPath, "es");
  return langs;
}

/**
 * Hreflang for blog posts where each locale has a unique slug.
 * Pass the map returned by getBlogPostAllSlugs().
 */
export function blogHreflangAlternates(
  slugsByLocale: Partial<Record<string, string>>
): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const [locale, slug] of Object.entries(slugsByLocale)) {
    if (!slug) continue;
    const prefix = locale === "es" ? "" : `/${locale}`;
    langs[locale] = `${APP_URL}${prefix}/blog/${slug}`;
  }
  if (langs["es"]) langs["x-default"] = langs["es"];
  return langs;
}
