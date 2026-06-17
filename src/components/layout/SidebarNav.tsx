"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Home, Send, Star, BarChart2, Settings, MessageSquare,
  Gift, CreditCard, MapPin, ChevronDown, Flag, UserCircle, User,
  Users, Store, TrendingUp, Briefcase, QrCode,
} from "lucide-react";

type NavItem = { href: string; labelKey: string; Icon: React.ElementType; tab?: string };
type NavGroup = { id: string; labelKey: string; Icon: React.ElementType; items: NavItem[]; defaultOpen: boolean };
type NavEntry = { type: "item"; href: string; labelKey: string; Icon: React.ElementType }
              | { type: "group"; group: NavGroup };

const STORAGE_KEY = "ry_sidebar_open";

const NAV: NavEntry[] = [
  { type: "item", href: "/dashboard", labelKey: "home", Icon: Home },
  {
    type: "group",
    group: {
      id: "clients",
      labelKey: "clientsGroup",
      Icon: Users,
      defaultOpen: true,
      items: [
        { href: "/clientes",  labelKey: "sendRequest", Icon: Send           },
        { href: "/resenas",   labelKey: "reviews",     Icon: MessageSquare  },
        { href: "/informes",  labelKey: "reports",     Icon: BarChart2      },
      ],
    },
  },
  {
    type: "group",
    group: {
      id: "google",
      labelKey: "googleBusiness",
      Icon: MapPin,
      defaultOpen: false,
      items: [
        { href: "/google-business", labelKey: "gbProfile",  Icon: Store,      tab: "profile"  },
        { href: "/google-business", labelKey: "gbReviews",  Icon: Star,       tab: "reviews"  },
        { href: "/google-business", labelKey: "gbAnalysis", Icon: TrendingUp, tab: "analysis" },
        { href: "/google-business", labelKey: "gbFlagged",  Icon: Flag,       tab: "flagged"  },
      ],
    },
  },
  {
    type: "group",
    group: {
      id: "config",
      labelKey: "configGroup",
      Icon: Settings,
      defaultOpen: false,
      items: [
        { href: "/configuracion", labelKey: "businessProfile", Icon: Briefcase },
        { href: "/incentivos",    labelKey: "incentives",      Icon: Gift      },
        { href: "/cartel",        labelKey: "qrPoster",        Icon: QrCode    },
      ],
    },
  },
  {
    type: "group",
    group: {
      id: "account",
      labelKey: "myAccount",
      Icon: UserCircle,
      defaultOpen: false,
      items: [
        { href: "/cuenta",      labelKey: "accountProfile", Icon: User       },
        { href: "/facturacion", labelKey: "billing",        Icon: CreditCard },
      ],
    },
  },
];

function isGroupActivePath(group: NavGroup, pathname: string) {
  return group.items.some((i) => {
    const base = i.href.split("?")[0];
    return pathname === base || pathname.startsWith(base + "/");
  });
}

function loadSavedGroupOpenStates(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; }
}

function buildNavItemHref(item: NavItem): string {
  if (item.tab && item.tab !== "profile") return `${item.href}?tab=${item.tab}`;
  return item.href;
}

export function SidebarNav() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const t            = useTranslations("common");

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const groups: Record<string, boolean> = {};
    NAV.forEach((e) => {
      if (e.type === "group") groups[e.group.id] = e.group.defaultOpen;
    });
    return groups;
  });

  useEffect(() => {
    const saved = loadSavedGroupOpenStates();
    setOpen((prev) => {
      const next = { ...prev };
      NAV.forEach((e) => {
        if (e.type !== "group") return;
        const g = e.group;
        if (isGroupActivePath(g, pathname)) {
          next[g.id] = true;
        } else if (g.id in saved) {
          next[g.id] = saved[g.id];
        }
      });
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    NAV.forEach((e) => {
      if (e.type === "group" && isGroupActivePath(e.group, pathname)) {
        setOpen((prev) => ({ ...prev, [e.group.id]: true }));
      }
    });
  }, [pathname]);

  function toggle(id: string) {
    setOpen((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function isNavItemActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function isItemActive(item: NavItem): boolean {
    const base = item.href.split("?")[0];
    if (pathname !== base && !pathname.startsWith(base + "/")) return false;
    if (!item.tab) return true;
    const activeTab = searchParams.get("tab") ?? "profile";
    return activeTab === item.tab;
  }

  return (
    <nav aria-label="Navegación principal" className="flex-1 p-3 overflow-y-auto space-y-0.5">
      {NAV.map((entry) => {
        if (entry.type === "item") {
          const active = isNavItemActive(entry.href);
          return (
            <Link
              key={entry.href}
              href={entry.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                ${active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <entry.Icon size={18} strokeWidth={active ? 2 : 1.75} className="shrink-0" />
              {t(entry.labelKey as Parameters<typeof t>[0])}
            </Link>
          );
        }

        const { group } = entry;
        const isOpen    = open[group.id] ?? group.defaultOpen;
        const hasActive = isGroupActivePath(group, pathname);

        return (
          <div key={group.id}>
            <button
              onClick={() => toggle(group.id)}
              aria-expanded={isOpen}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                ${hasActive
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <group.Icon size={18} strokeWidth={1.75} className="shrink-0" />
              <span className="flex-1 text-left">{t(group.labelKey as Parameters<typeof t>[0])}</span>
              <ChevronDown
                size={15}
                className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="mt-0.5 ml-3 pl-4 border-l border-gray-100 space-y-0.5">
                {group.items.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <Link
                      key={item.tab ?? item.href}
                      href={buildNavItemHref(item)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition
                        ${active
                          ? "bg-gray-900 text-white"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                    >
                      <item.Icon size={16} strokeWidth={active ? 2 : 1.75} className="shrink-0" />
                      {t(item.labelKey as Parameters<typeof t>[0])}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
