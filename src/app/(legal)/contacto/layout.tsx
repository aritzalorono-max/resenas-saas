import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — ReseñasYa",
  description:
    "Escríbenos para soporte técnico, consultas sobre planes o cualquier otra duda. Respondemos en menos de 24 horas.",
  alternates: { canonical: "/contacto" },
  robots: { index: true, follow: true },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
