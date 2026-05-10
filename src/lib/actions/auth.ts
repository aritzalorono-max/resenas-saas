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

  return data
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

export async function signUp(email: string, password: string, fullName: string, role: UserRole) {
  const supabase = await createClient()

  // Check if this is the very first user — auto-promotes to admin
  const { count } = await supabase
    .from('guardias_profiles')
    .select('*', { count: 'exact', head: true })

  const effectiveRole: UserRole = count === 0 ? 'admin' : role

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
  if (authError) return { error: authError.message }
  if (!authData.user) return { error: 'No se pudo crear el usuario.' }

  const { error: profileError } = await supabase
    .from('guardias_profiles')
    .insert({ id: authData.user.id, full_name: fullName, role: effectiveRole })

  if (profileError) return { error: profileError.message }
  return { success: true, role: effectiveRole }
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
