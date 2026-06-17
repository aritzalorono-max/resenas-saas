import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CookieBanner } from "@/components/cookies/CookieBanner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const all = await getMessages();
  // Only ship universal namespaces at this level — sub-layouts add their own.
  // CookieBanner and LanguageSwitcher are the only client components here.
  const messages = {
    common: all.common,
    cookieBanner: all.cookieBanner,
    cookieCategories: all.cookieCategories,
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <CookieBanner />
    </NextIntlClientProvider>
  );
}
