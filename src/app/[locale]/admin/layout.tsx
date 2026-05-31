import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";

export const metadata = { title: "Backoffice · ResenasYa" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (adminEmails.length === 0 || !adminEmails.includes(user.email ?? "")) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center shrink-0">
            <span className="text-[9px] font-black text-white">AD</span>
          </div>
          <span className="font-bold text-white text-sm tracking-tight">ResenasYa · Backoffice</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-gray-600 text-xs hidden sm:block">{user.email}</span>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-xs transition">
            ← Volver al app
          </Link>
        </div>
      </header>
      <main className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {children}
      </main>
    </div>
  );
}
