import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/actions/auth'
import { listDoctors, listAllShiftCounters } from '@/lib/actions/doctors'
import { listTeamMembers, listInvitations } from '@/lib/actions/teams'
import { MedicosClient } from '@/components/medicos/MedicosClient'

export default async function MedicosPage() {
  const anio = new Date().getFullYear()
  const profile = await getCurrentProfile()
  if (!profile?.active_team_id) redirect('/login')

  const teamId = profile.active_team_id as string

  const [doctors, members, invitations, counters] = await Promise.all([
    listDoctors(),
    listTeamMembers(teamId),
    listInvitations(teamId),
    listAllShiftCounters(anio),
  ])

  const canEdit = profile.role === 'admin' || profile.role === 'gestor'

  return (
    <MedicosClient
      doctors={doctors}
      members={members}
      invitations={invitations}
      counters={counters}
      canEdit={canEdit}
      anio={anio}
    />
  )
}
