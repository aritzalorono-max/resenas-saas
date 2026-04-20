import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { BottomNav } from "@/components/layout/BottomNav";

const navItems = [
  { href: "/dashboard",     label: "Inicio",           icon: "🏠" },
  { href: "/clientes",      label: "Enviar solicitud", icon: "💬" },
  { href: "/resenas",       label: "Reseñas",          icon: "⭐" },
  { href: "/configuracion", label: "Configuración",    icon: "⚙️" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar (solo desktop lg+) ────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-bold text-brand-700">ReseñasYa</span>
          </Link>
          {business && (
            <p className="text-sm text-gray-500 mt-1 truncate">{business.name}</p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700
                         hover:bg-brand-50 hover:text-brand-700 transition font-medium text-sm"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate mb-2">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Contenido principal ────────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header móvil */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3
                           bg-white border-b border-gray-100 sticky top-0 z-40">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="text-lg font-bold text-brand-700">ReseñasYa</span>
          </Link>
          {business && (
            <span className="text-sm text-gray-500 truncate max-w-[160px]">{business.name}</span>
          )}
        </header>

        {/* Zona de contenido: padding inferior extra para dejar espacio a la nav móvil */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* ── Navegación inferior (solo móvil) ──────────────────────────────── */}
      <BottomNav />
    </div>
  );
}
