import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | ReseñasYa",
  description: "Accede a tu panel de ReseñasYa y gestiona tus reseñas automáticas por WhatsApp.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
