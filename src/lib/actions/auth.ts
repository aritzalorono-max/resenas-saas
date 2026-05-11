'use server'

import { createClient } from '@/lib/supabase/server'

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
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/api/auth/callback`,
  })
  if (error) return { error: error.message }
  return { success: true }
}
