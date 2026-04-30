import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/cookies/CookieBanner";
import { ConditionalScripts } from "@/components/cookies/ConditionalScripts";

const inter = Inter({ subsets: ["latin"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "ReseñasYa — Consigue más reseñas de 5★ automáticamente por WhatsApp",
    template: "%s | ReseñasYa",
  },
  description:
    "Envía WhatsApps automáticos a tus clientes, analiza su opinión con IA y consigue reseñas en Google Maps, App Store, Play Store o Trustpilot. Para negocios locales, apps y e-commerce.",
  keywords: [
    "reseñas google maps",
    "conseguir reseñas google",
    "más reseñas app store",
    "valoraciones play store",
    "reseñas trustpilot automáticas",
    "automatizar reseñas whatsapp",
    "whatsapp reseñas clientes",
    "gestión reputación online negocio",
    "reseñas positivas google maps restaurante",
    "software reseñas negocios locales",
    "reseñas psicólogo abogado gestoría",
  ],
  authors: [{ name: "ReseñasYa" }],
  creator: "ReseñasYa",
  publisher: "ReseñasYa",
  manifest: "/manifest.json",
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: APP_URL,
    siteName: "ReseñasYa",
    title: "ReseñasYa — Consigue más reseñas de 5★ automáticamente por WhatsApp",
    description:
      "Envía WhatsApps automáticos a tus clientes, analiza su opinión con IA y consigue reseñas en Google Maps, App Store, Play Store o Trustpilot. Para negocios locales, apps y e-commerce.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ReseñasYa — Automatiza tus reseñas en Google, App Store, Play Store y Trustpilot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReseñasYa — Más reseñas de 5★ automáticamente por WhatsApp",
    description:
      "IA + WhatsApp para conseguir más reseñas en Google Maps, App Store, Play Store o Trustpilot. Para cualquier negocio.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ReseñasYa",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <CookieBanner />
        <ConditionalScripts />
      </body>
    </html>
  );
}
