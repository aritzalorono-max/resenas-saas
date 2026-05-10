// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { type GuardiasProfile, type UserRole } from '@/types'

export async function getCurrentProfile(): Promise<GuardiasProfile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('guardias_profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  if (data) return data
  // Profile missing (e.g. email confirmation happened before the column existed) – create it now
  const defaultName = (user.email ?? '').split('@')[0]
  const { data: newProfile } = await supabase
    .from('guardias_profiles')
    .insert({ id: user.id, full_name: defaultName, role: 'medico' })
    .select()
    .single()
  return newProfile
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function signUp(email: string, password: string, fullName: string, inviteToken?: string) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
  if (authError) return { error: authError.message }
  if (!authData.user) return { error: 'No se pudo crear el usuario.' }

  // Profile insert may fail if email confirmation is required (no session yet).
  // The callback route will retry after the user confirms their email.
  await supabase
    .from('guardias_profiles')
    .insert({ id: authData.user.id, full_name: fullName, role: 'medico' })
    .select()
    .single()

  // If there's an invite token, auto-accept it
  if (inviteToken) {
    const { data: inv } = await supabase
      .from('guardias_team_invitations')
      .select('*')
      .eq('token', inviteToken)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (inv) {
      await supabase
        .from('guardias_team_members')
        .insert({ team_id: inv.team_id, profile_id: authData.user.id, role: inv.role, status: 'active' })

      await supabase
        .from('guardias_team_invitations')
        .update({ used_at: new Date().toISOString() })
        .eq('token', inviteToken)

      await supabase
        .from('guardias_profiles')
        .update({ active_team_id: inv.team_id })
        .eq('id', authData.user.id)

      return { success: true, hasTeam: true }
    }
  }

  return { success: true, hasTeam: false }
}

export async function listProfiles(): Promise<GuardiasProfile[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guardias_profiles')
    .select('*')
    .order('full_name')
  return data ?? []
}

export async function updateProfileRole(profileId: string, role: UserRole) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('guardias_profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', profileId)
  if (error) return { error: error.message }
  return { success: true }
}
