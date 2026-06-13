import Link from "next/link";
import { ManageCookiesButton } from "@/components/cookies/ManageCookiesButton";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center shrink-0">
              <span className="text-[10px] font-extrabold text-white tracking-tight leading-none select-none">RY</span>
            </div>
            <span className="text-base font-bold text-gray-900">ReseñasYa</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/#precios" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden sm:block">Precios</Link>
            <Link href="/blog" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden sm:block">Blog</Link>
            <Link href="/login" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden sm:block">Iniciar sesión</Link>
            <Link href="/register" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-100 bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 mb-10">
            <div className="lg:w-56 shrink-0">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-extrabold text-white tracking-tight leading-none select-none">RY</span>
                </div>
                <span className="font-bold text-gray-800">ReseñasYa</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Consigue más reseñas en Google Maps, App Store, Play Store, Trustpilot o cualquier otra plataforma mediante WhatsApp e inteligencia artificial.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Producto</p>
                <ul className="space-y-2">
                  <li><Link href="/#precios" className="text-sm text-gray-500 hover:text-gray-800 transition">Precios</Link></li>
                  <li><Link href="/#sectores" className="text-sm text-gray-500 hover:text-gray-800 transition">Sectores</Link></li>
                  <li><Link href="/casos-exito" className="text-sm text-gray-500 hover:text-gray-800 transition">Casos de éxito</Link></li>
                  <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-800 transition">Blog</Link></li>
                  <li><Link href="/faq" className="text-sm text-gray-500 hover:text-gray-800 transition">Preguntas frecuentes</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Soporte</p>
                <ul className="space-y-2">
                  <li><Link href="/contacto" className="text-sm text-gray-500 hover:text-gray-800 transition">Contacto</Link></li>
                  <li><a href="mailto:info@resenasya.com" className="text-sm text-gray-500 hover:text-gray-800 transition">info@resenasya.com</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Legal</p>
                <ul className="space-y-2">
                  <li><Link href="/terminos" className="text-sm text-gray-500 hover:text-gray-800 transition">Términos y condiciones</Link></li>
                  <li><Link href="/privacidad" className="text-sm text-gray-500 hover:text-gray-800 transition">Privacidad y aviso legal</Link></li>
                  <li><Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-800 transition">Política de cookies</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} Buy & Click, SL Todos los derechos reservados.</p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 items-center">
              <Link href="/privacidad" className="hover:text-gray-600 transition">Privacidad</Link>
              <Link href="/terminos" className="hover:text-gray-600 transition">Términos</Link>
              <Link href="/cookies" className="hover:text-gray-600 transition">Cookies</Link>
              <ManageCookiesButton />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
