import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogOut, Stethoscope } from 'lucide-react'
import { signOut } from '@/lib/actions/auth'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600">
        <Stethoscope className="w-8 h-8 text-white" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Guardias</h1>
        <p className="text-gray-500 mt-1">Bienvenido, {user.email}</p>
      </div>
      <form action={signOut}>
        <button type="submit" className="btn-secondary">
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}
