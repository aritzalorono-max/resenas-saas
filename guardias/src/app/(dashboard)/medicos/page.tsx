import { getCurrentProfile, listProfiles } from '@/lib/actions/auth'
import { listDoctors, listAllShiftCounters } from '@/lib/actions/doctors'
import { MedicosClient } from '@/components/medicos/MedicosClient'

export default async function MedicosPage() {
  const anio = new Date().getFullYear()

  const [profile, doctors, profiles, counters] = await Promise.all([
    getCurrentProfile(),
    listDoctors(),
    listProfiles(),
    listAllShiftCounters(anio),
  ])

  const canEdit = profile?.role === 'admin' || profile?.role === 'gestor'

  return (
    <MedicosClient
      doctors={doctors}
      profiles={profiles}
      counters={counters}
      canEdit={canEdit}
      anio={anio}
    />
  )
}
