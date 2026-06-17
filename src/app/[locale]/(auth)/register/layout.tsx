import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta gratis | ResenasYa",
  description: "Regístrate gratis y empieza a conseguir más reseñas en Google Maps, App Store y Play Store automáticamente por WhatsApp.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
