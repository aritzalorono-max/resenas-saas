// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code     = searchParams.get('code')
  const next     = searchParams.get('next') ?? '/onboarding'
  const teamCode = searchParams.get('teamCode')?.trim().toUpperCase() ?? null
  const invite   = searchParams.get('invite') ?? null

  if (code) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (user) {
      // Ensure a profile exists
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

      let teamId = existingProfile?.active_team_id ?? null

      // Auto-join via team code if provided and user has no team yet
      if (!teamId && teamCode) {
        const { data: team } = await supabase
          .from('guardias_teams')
          .select('id')
          .eq('codigo', teamCode)
          .single()

        if (team) {
          await supabase
            .from('guardias_team_members')
            .insert({ team_id: team.id, profile_id: user.id, role: 'medico', status: 'active' })

          await supabase
            .from('guardias_profiles')
            .update({ active_team_id: team.id })
            .eq('id', user.id)

          teamId = team.id
        }
      }

      // Auto-accept email invitation if token provided
      if (!teamId && invite) {
        const { data: inv } = await supabase
          .from('guardias_team_invitations')
          .select('*')
          .eq('token', invite)
          .is('used_at', null)
          .gt('expires_at', new Date().toISOString())
          .single()

        if (inv) {
          await supabase
            .from('guardias_team_members')
            .insert({ team_id: inv.team_id, profile_id: user.id, role: inv.role, status: 'active' })

          await supabase
            .from('guardias_team_invitations')
            .update({ used_at: new Date().toISOString() })
            .eq('token', invite)

          await supabase
            .from('guardias_profiles')
            .update({ active_team_id: inv.team_id })
            .eq('id', user.id)

          teamId = inv.team_id
        }
      }

      const redirectTo = teamId ? '/dashboard' : '/onboarding'
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
