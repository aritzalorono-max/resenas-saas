"use client";

import Script from "next/script";
import { useCookieConsent } from "@/hooks/useCookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function ConditionalScripts() {
  const { consent } = useCookieConsent();

  if (!consent?.analytics || !GA_ID) return null;

  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>
      <Script
        id="ga-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
