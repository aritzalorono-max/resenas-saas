import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/actions/auth'
import { listTeamMembers, listInvitations, getMyTeamRole } from '@/lib/actions/teams'
import { createClient } from '@/lib/supabase/server'
import { EquipoClient } from '@/components/equipo/EquipoClient'

export default async function EquipoPage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')
  if (!profile.active_team_id) redirect('/onboarding')

  const supabase = await createClient()
  const { data: team } = await supabase
    .from('guardias_teams')
    .select('*')
    .eq('id', profile.active_team_id)
    .single()

  if (!team) redirect('/onboarding')

  const [members, invitations, myRole] = await Promise.all([
    listTeamMembers(profile.active_team_id),
    listInvitations(profile.active_team_id),
    getMyTeamRole(),
  ])

  return (
    <EquipoClient
      team={team}
      members={members}
      invitations={invitations}
      myRole={myRole ?? 'medico'}
      myProfileId={profile.id}
    />
  )
}
