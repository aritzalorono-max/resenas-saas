"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Send, Star, BarChart2, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard",     label: "Inicio",    Icon: Home      },
  { href: "/clientes",      label: "Enviar",    Icon: Send      },
  { href: "/resenas",       label: "Reseñas",   Icon: Star      },
  { href: "/informes",      label: "Informes",  Icon: BarChart2 },
  { href: "/configuracion", label: "Ajustes",    Icon: Settings  },
];

/** Barra de navegación inferior visible solo en móvil (< lg) */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200
                    flex items-stretch safe-bottom">
      {navItems.map(({ href, label, Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px]
                        text-xs font-medium transition-colors
                        ${isActive
                          ? "text-brand-600"
                          : "text-gray-500 active:text-brand-600"
                        }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
