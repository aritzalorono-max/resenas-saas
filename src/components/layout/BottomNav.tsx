"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Home, Send, Star, MapPin, MoreHorizontal,
  BarChart2, Settings, Gift, Printer, UserCircle, CreditCard, X,
} from "lucide-react";

const SECONDARY_NAV_ITEMS = [
  { href: "/informes",      labelKey: "reports",         Icon: BarChart2   },
  { href: "/configuracion", labelKey: "businessProfile", Icon: Settings    },
  { href: "/incentivos",    labelKey: "incentives",      Icon: Gift        },
  { href: "/cartel",        labelKey: "qrPoster",        Icon: Printer     },
  { href: "/cuenta",        labelKey: "myAccount",       Icon: UserCircle  },
  { href: "/facturacion",   labelKey: "billing",         Icon: CreditCard  },
] as const;

type LabelKey = (typeof SECONDARY_NAV_ITEMS)[number]["labelKey"] | "home" | "sendRequest" | "reviews" | "googleShort" | "more";

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);

  const moreActive = SECONDARY_NAV_ITEMS.some(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/")
  );

  const primaryNavItems = [
    { href: "/dashboard",       labelKey: "home" as LabelKey,        Icon: Home   },
    { href: "/clientes",        labelKey: "sendRequest" as LabelKey, Icon: Send   },
    { href: "/resenas",         labelKey: "reviews" as LabelKey,     Icon: Star   },
    { href: "/google-business", labelKey: "googleShort" as LabelKey, Icon: MapPin },
  ];

  return (
    <>
      <nav aria-label="Navegación móvil" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200
                      flex items-stretch safe-bottom">
        {primaryNavItems.map(({ href, labelKey, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px]
                          text-xs font-medium transition-colors
                          ${isActive ? "text-brand-600" : "text-gray-500 active:text-brand-600"}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />
              <span>{t(labelKey)}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px]
                      text-xs font-medium transition-colors
                      ${moreActive ? "text-brand-600" : "text-gray-500 active:text-brand-600"}`}
        >
          <MoreHorizontal size={20} strokeWidth={moreActive ? 2 : 1.75} />
          <span>{t("more")}</span>
        </button>
      </nav>

      {/* More sheet */}
      {open && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl
                          shadow-xl safe-bottom pb-2">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-sm font-semibold text-gray-700">{t("more")}</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="p-1 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 px-3 pb-4">
              {SECONDARY_NAV_ITEMS.map(({ href, labelKey, Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-xs
                                font-medium transition-colors
                                ${isActive
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2 : 1.75} />
                    <span className="text-center leading-tight">{t(labelKey)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
