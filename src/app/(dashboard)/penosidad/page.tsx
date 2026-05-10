import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/actions/auth'
import { listPenosidadConfig } from '@/lib/actions/penosidad'
import { PenosidadList } from '@/components/penosidad/PenosidadList'

export default async function PenosidadPage() {
  const profile = await getCurrentProfile()

  if (profile?.role === 'medico') redirect('/dashboard')

  const items = await listPenosidadConfig()

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Jerarquía de Penosidad</h1>
        <p className="text-gray-500 mt-1">
          Define qué tipos de guardia son más penosos y cuántos puntos aportan.
          Nivel 1 = máxima penosidad.
        </p>
      </div>

      <PenosidadList items={items} canEdit={profile?.role === 'admin' || profile?.role === 'gestor'} />
    </div>
  )
}
