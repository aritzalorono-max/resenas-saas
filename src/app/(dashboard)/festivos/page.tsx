import { getCurrentProfile } from '@/lib/actions/auth'
import { listHolidays, listSpecialDays } from '@/lib/actions/holidays'
import { FestivosClient } from '@/components/festivos/FestivosClient'

export default async function FestivosPage({
  searchParams,
}: {
  searchParams: Promise<{ anio?: string }>
}) {
  const params  = await searchParams
  const anio    = Number(params.anio ?? new Date().getFullYear())

  const [profile, holidays, specialDays] = await Promise.all([
    getCurrentProfile(),
    listHolidays(anio),
    listSpecialDays(anio),
  ])

  const canEdit = profile?.role === 'admin' || profile?.role === 'gestor'

  return (
    <FestivosClient
      holidays={holidays}
      specialDays={specialDays}
      canEdit={canEdit}
      anio={anio}
    />
  )
}
