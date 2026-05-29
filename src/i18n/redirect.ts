import { redirect as nextRedirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { routing } from "./routing";

/**
 * Locale-aware redirect for server components.
 * Prepends the locale prefix for non-default locales.
 */
export async function redirect(path: string): Promise<never> {
  const locale = await getLocale();
  const prefix = locale !== routing.defaultLocale ? `/${locale}` : "";
  return nextRedirect(`${prefix}${path}`) as never;
}
