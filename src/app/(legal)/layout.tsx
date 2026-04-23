import Link from "next/link";
import { ManageCookiesButton } from "@/components/cookies/ManageCookiesButton";

const legalLinks = [
  { href: "/faq",       label: "Preguntas frecuentes" },
  { href: "/terminos",  label: "Términos y condiciones" },
  { href: "/privacidad", label: "Privacidad y aviso legal" },
  { href: "/cookies",   label: "Política de cookies" },
  { href: "/contacto",  label: "Contacto" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span className="font-bold text-brand-700 text-sm">ReseñasYa</span>
          </Link>
          <nav className="flex items-center gap-4 overflow-x-auto">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-500 hover:text-gray-900 whitespace-nowrap transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition">← Volver a ReseñasYa</Link>
          <div className="flex items-center gap-4">
            <ManageCookiesButton />
            <p>© {new Date().getFullYear()} ReseñasYa. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
