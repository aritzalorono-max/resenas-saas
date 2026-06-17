import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  const [locale, all] = await Promise.all([getLocale(), getMessages()]);
  // The onboarding page is a client component using the `onboarding` namespace.
  const messages = { onboarding: all.onboarding, common: all.common };

  return (
    <div className="min-h-screen bg-gray-50">
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
