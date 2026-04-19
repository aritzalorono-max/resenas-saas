import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReseñasYa — Reseñas en Google Maps por WhatsApp",
  description:
    "Automatiza la recopilación de reseñas de Google Maps. Envía WhatsApps a tus clientes, analiza su opinión con IA y consigue más reseñas positivas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
