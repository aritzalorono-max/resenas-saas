import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { BottomNav } from "@/components/layout/BottomNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";
import {
  Home, Send, Star, Settings, Printer, UserCircle,
  Gift, BarChart2, CreditCard, ShieldCheck, MapPin,
} from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
        <span className="text-[11px] font-extrabold text-white tracking-tight leading-none select-none">RY</span>
      </div>
      <span className="text-base font-bold text-gray-900 tracking-tight">ResenasYa</span>
    </div>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business, error: bizError } = await supabase
    .from("businesses")
    .select("name")
    .eq("user_id", user.id)
    .single();

  if (!bizError && !business?.name) redirect("/onboarding");

  const isAdmin = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .includes(user.email ?? "");

  const t = await getTranslations("common");

  const navItems = [
    { href: "/dashboard",     label: t("home"),            Icon: Home        },
    { href: "/clientes",      label: t("sendRequest"),      Icon: Send        },
    { href: "/resenas",       label: t("reviews"),          Icon: Star        },
    { href: "/informes",      label: t("reports"),          Icon: BarChart2   },
    { href: "/incentivos",    label: t("incentives"),       Icon: Gift        },
    { href: "/configuracion", label: t("businessProfile"),  Icon: Settings    },
    { href: "/google-business", label: t("googleBusiness"),   Icon: MapPin      },
    { href: "/cartel",        label: t("qrPoster"),         Icon: Printer     },
    { href: "/facturacion",   label: t("billing"),          Icon: CreditCard  },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar (solo desktop lg+) ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col fixed h-full shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <Link href="/dashboard">
            <Logo />
          </Link>
          {business && (
            <p className="text-xs text-gray-400 mt-2 truncate pl-0.5">{business.name}</p>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600
                         hover:bg-gray-50 hover:text-gray-900 transition font-medium text-sm"
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <p className="text-xs text-gray-400 truncate px-1">{user.email}</p>
          <Link
            href="/cuenta"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition font-medium"
          >
            <UserCircle className="w-4 h-4 shrink-0" />
            {t("myAccount")}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition font-medium"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {t("backoffice")}
            </Link>
          )}
          <div className="px-1">
            <LanguageSwitcher compact />
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Contenido principal ────────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header móvil */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3
                           bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            {business && (
              <span className="text-xs text-gray-400 truncate max-w-[120px]">{business.name}</span>
            )}
            <LanguageSwitcher compact />
            <Link href="/cuenta" aria-label={t("myAccount")}>
              <UserCircle className="w-6 h-6 text-gray-400 hover:text-gray-700 transition" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* ── Navegación inferior (solo móvil) ────────────────────────────────── */}
      <BottomNav />
    </div>
  );
}
