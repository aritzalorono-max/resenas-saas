import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/components/layout/LogoutButton";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: "🏠" },
  { href: "/clientes", label: "Enviar solicitud", icon: "💬" },
  { href: "/resenas", label: "Reseñas", icon: "⭐" },
  { href: "/configuracion", label: "Configuración", icon: "⚙️" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition font-medium text-sm"
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

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
