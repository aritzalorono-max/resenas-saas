import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | ResenasYa",
  description: "Accede a tu panel de ResenasYa y gestiona tus reseñas automáticas por WhatsApp.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
