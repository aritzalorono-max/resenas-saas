import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/actions/auth'
import { getMyTeamRole } from '@/lib/actions/teams'
import { getRulesConfig } from '@/lib/actions/cuadrante'
import { listDoctors, listDoctorPeriodos } from '@/lib/actions/doctors'
import { ReglasClient } from '@/components/reglas/ReglasClient'
import type { DoctorProfile, DoctorPeriodo } from '@/types'

export default async function ReglasPage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  const teamRole = profile.active_team_id
    ? await getMyTeamRole(profile.active_team_id)
    : null

  const canEdit =
    profile.role === 'admin' ||
    profile.role === 'gestor' ||
    teamRole === 'gestor'

  if (!canEdit) redirect('/dashboard')

  const [rules, doctors] = await Promise.all([
    getRulesConfig(),
    listDoctors(),
  ])

  // Load periodos for each active doctor
  const activeDoctors = doctors.filter(d => d.activo)
  const periodosByDoctor: Record<string, DoctorPeriodo[]> = {}
  await Promise.all(
    activeDoctors.map(async d => {
      periodosByDoctor[d.id] = await listDoctorPeriodos(d.id)
    })
  )

  const anio = new Date().getFullYear()

  return (
    <ReglasClient
      rules={rules}
      doctors={activeDoctors}
      periodosByDoctor={periodosByDoctor}
      anio={anio}
    />
  )
}
