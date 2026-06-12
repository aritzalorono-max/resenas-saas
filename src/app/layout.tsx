import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalScripts } from "@/components/cookies/ConditionalScripts";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "ResenasYa — Consigue más reseñas de 5★ automáticamente por WhatsApp",
    template: "%s | ResenasYa",
  },
  description:
    "Envía WhatsApps automáticos, analiza opiniones con IA y consigue reseñas en Google Maps, App Store, Play Store o Trustpilot. Prueba gratis sin tarjeta.",
  authors: [{ name: "ResenasYa" }],
  creator: "ResenasYa",
  publisher: "ResenasYa",
  manifest: "/manifest.json",
  alternates: { canonical: APP_URL },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: APP_URL,
    siteName: "ResenasYa",
    title: "ResenasYa — Consigue más reseñas de 5★ automáticamente por WhatsApp",
    description:
      "Envía WhatsApps automáticos, analiza opiniones con IA y consigue reseñas en Google Maps, App Store, Play Store o Trustpilot. Prueba gratis sin tarjeta.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResenasYa — Más reseñas de 5★ automáticamente por WhatsApp",
    description: "IA + WhatsApp para conseguir más reseñas en Google Maps, App Store, Play Store o Trustpilot. Automatiza la captación de opiniones y mejora tu reputación online.",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "ResenasYa" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: { google: "ePD94B5VbO3yhJKMFAQcksCn4XfokHF7pSgPMhHumiE" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : null;

  return (
    <html lang={locale}>
      <head>
        {supabaseHost && (
          <>
            <link rel="preconnect" href={`https://${supabaseHost}`} />
            <link rel="dns-prefetch" href={`https://${supabaseHost}`} />
          </>
        )}
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body className={inter.className}>
        {children}
        <ConditionalScripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
