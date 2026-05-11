import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/actions/auth'
import { getDoctorProfile } from '@/lib/actions/doctors'
import { createClient } from '@/lib/supabase/server'
import { CuentaClient } from '@/components/cuenta/CuentaClient'

export default async function CuentaPage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const doctorProfile = profile.active_team_id
    ? await getDoctorProfile(profile.id)
    : null

  return (
    <CuentaClient
      fullName={profile.full_name}
      email={user?.email ?? ''}
      doctorProfile={doctorProfile}
    />
  )
}
