// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (user) {
      // Ensure a profile exists (may not exist if insert failed before email confirmation)
      const { data: existingProfile } = await supabase
        .from('guardias_profiles')
        .select('id, active_team_id')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        const defaultName = (user.email ?? '').split('@')[0]
        await supabase
          .from('guardias_profiles')
          .insert({ id: user.id, full_name: defaultName, role: 'medico' })
      }

      // Redirect to dashboard if already has a team, otherwise onboarding
      const teamId = existingProfile?.active_team_id
      const redirectTo = teamId ? '/dashboard' : '/onboarding'
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
