import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/actions/auth'
import { OnboardingClient } from '@/components/onboarding/OnboardingClient'

export default async function OnboardingPage() {
  const profile = await getCurrentProfile()

  // No profile and no auth session → send to login
  // But if the user IS authenticated and profile creation is failing,
  // do NOT redirect to /login – that creates a redirect loop with the middleware.
  // Instead, show the onboarding form with a fallback name.
  if (profile?.active_team_id) redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 px-4">
      <OnboardingClient fullName={profile?.full_name ?? ''} />
    </div>
  )
}
