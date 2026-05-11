import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { CuentaClient } from '@/components/cuenta/CuentaClient'

export default async function CuentaPage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/onboarding')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <CuentaClient
      fullName={profile.full_name}
      email={user?.email ?? ''}
    />
  )
}
