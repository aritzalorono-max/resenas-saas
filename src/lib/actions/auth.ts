'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { type Profile } from '@/types'

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { success: true }
}

export async function signUp(email: string, password: string) {
  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${appUrl}/api/auth/callback` },
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/api/auth/callback?next=/restablecer`,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }
  return { success: true }
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return data ?? null
}

export async function updateProfile(data: {
  fullName?: string
  hospital?: string
  especialidad?: string
  nombreServicio?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const update: Record<string, string> = { updated_at: new Date().toISOString() }
  if (data.fullName      !== undefined) update.full_name       = data.fullName
  if (data.hospital      !== undefined) update.hospital        = data.hospital
  if (data.especialidad  !== undefined) update.especialidad    = data.especialidad
  if (data.nombreServicio !== undefined) update.nombre_servicio = data.nombreServicio

  const { error } = await supabase.from('profiles').update(update).eq('id', user.id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { error } = await supabase.rpc('delete_my_account')
  if (error) return { error: error.message }
  await supabase.auth.signOut()
  return { success: true }
}
