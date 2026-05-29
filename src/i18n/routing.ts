import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "fr", "de", "it", "pt"],
  defaultLocale: "es",
  localePrefix: "as-needed", // Spanish at /, others at /en/, /fr/, etc.
});

export type Locale = (typeof routing.locales)[number];
