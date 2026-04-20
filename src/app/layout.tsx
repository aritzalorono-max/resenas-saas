import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "ReseñasYa — Consigue más reseñas de Google Maps automáticamente por WhatsApp",
    template: "%s | ReseñasYa",
  },
  description:
    "Envía WhatsApp automáticos a tus clientes para conseguir más reseñas positivas en Google Maps. Ideal para restaurantes, peluquerías y negocios locales.",
  keywords: [
    "reseñas google maps",
    "conseguir reseñas google",
    "más reseñas google maps restaurante",
    "automatizar reseñas google",
    "whatsapp reseñas clientes",
    "gestión reputación online negocio",
    "reseñas positivas google maps",
    "software reseñas negocios locales",
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
    title: "ReseñasYa — Consigue más reseñas de Google Maps automáticamente por WhatsApp",
    description:
      "Envía WhatsApp automáticos a tus clientes para conseguir más reseñas positivas en Google Maps. Ideal para restaurantes, peluquerías y negocios locales.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ReseñasYa — Automatiza tus reseñas de Google Maps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReseñasYa — Más reseñas Google Maps por WhatsApp",
    description:
      "Automatiza la recogida de reseñas de Google Maps enviando WhatsApps a tus clientes. IA analiza el sentimiento y dirige a los satisfechos a dejar reseña.",
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
  themeColor: "#16a34a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
