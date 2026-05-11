import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'
import { Stethoscope, LogOut, UserCog } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('nombre_servicio').eq('id', user.id).single()
  const serviceName = profile?.nombre_servicio?.trim() || 'Guardias'

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Stethoscope size={14} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm truncate max-w-[180px]">{serviceName}</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link href="/cuenta"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <UserCog size={15} />
              <span className="hidden sm:inline">Mi cuenta</span>
            </Link>
            <form action={signOut}>
              <button type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <LogOut size={15} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
