import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Building2, Stethoscope, UserCog, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const hasServiceInfo = profile?.hospital || profile?.especialidad || profile?.nombre_servicio

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{user.email}</p>
      </div>

      {hasServiceInfo ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Stethoscope size={20} className="text-blue-600" />
            </div>
            <div className="space-y-1 min-w-0">
              {profile?.nombre_servicio && (
                <p className="font-semibold text-gray-900">{profile.nombre_servicio}</p>
              )}
              {profile?.especialidad && (
                <p className="text-sm text-gray-600">{profile.especialidad}</p>
              )}
              {profile?.hospital && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Building2 size={13} />
                  {profile.hospital}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="font-semibold text-blue-900 mb-1">Configura tu servicio</h2>
          <p className="text-sm text-blue-700 mb-4">
            Indica el hospital, especialidad y nombre del servicio para personalizar la aplicación.
          </p>
          <Link href="/cuenta" className="btn-primary inline-flex">
            Ir a Mi cuenta
            <ArrowRight size={15} />
          </Link>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <UserCog size={18} className="text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Mi cuenta</p>
              <p className="text-xs text-gray-500">Contraseña, datos del servicio</p>
            </div>
          </div>
          <Link href="/cuenta" className="text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
