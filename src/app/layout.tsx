import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/cookies/CookieBanner";
import { ConditionalScripts } from "@/components/cookies/ConditionalScripts";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "ReseñasYa — Consigue más reseñas de 5★ automáticamente por WhatsApp",
    template: "%s | ReseñasYa",
  },
  description:
    "Envía WhatsApps automáticos a tus clientes, analiza su opinión con IA y consigue reseñas en Google Maps, App Store, Play Store o Trustpilot.",
  authors: [{ name: "ReseñasYa" }],
  creator: "ReseñasYa",
  publisher: "ReseñasYa",
  manifest: "/manifest.json",
  alternates: { canonical: APP_URL },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: APP_URL,
    siteName: "ReseñasYa",
    title: "ReseñasYa — Consigue más reseñas de 5★ automáticamente por WhatsApp",
    description:
      "Envía WhatsApps automáticos a tus clientes, analiza su opinión con IA y consigue reseñas en Google Maps, App Store, Play Store o Trustpilot.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReseñasYa — Más reseñas de 5★ automáticamente por WhatsApp",
    description: "IA + WhatsApp para conseguir más reseñas en Google Maps, App Store, Play Store o Trustpilot.",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "ReseñasYa" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
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
      </head>
      <body className={inter.className}>
        {children}
        <CookieBanner />
        <ConditionalScripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
