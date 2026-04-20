"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard",     label: "Inicio",    icon: "🏠" },
  { href: "/clientes",      label: "Enviar",    icon: "💬" },
  { href: "/resenas",       label: "Reseñas",   icon: "⭐" },
  { href: "/configuracion", label: "Config",    icon: "⚙️" },
];

/** Barra de navegación inferior visible solo en móvil (< lg) */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200
                    flex items-stretch safe-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px]
                        text-xs font-medium transition-colors
                        ${isActive
                          ? "text-brand-600"
                          : "text-gray-400 active:text-brand-600"
                        }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
