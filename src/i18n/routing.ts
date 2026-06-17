import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "fr", "de", "it", "pt"],
  defaultLocale: "es",
  localePrefix: "as-needed", // Spanish at /, others at /en/, /fr/, etc.
  // Disable Accept-Language auto-redirect: Google recommends letting users
  // choose language rather than auto-redirecting, and it prevents canonical
  // mismatches when crawlers with non-Spanish Accept-Language headers visit
  // the root URL expecting to index the Spanish (default) page.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
