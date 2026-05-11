'use server'

import { createClient } from '@/lib/supabase/server'
import { type Doctor, type DoctorCategoria } from '@/types'

async function getUid(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function listDoctors(): Promise<Doctor[]> {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return []
  const { data } = await supabase
    .from('doctors')
    .select('*')
    .eq('profile_id', uid)
    .order('categoria')
    .order('nombre')
  return (data ?? []) as Doctor[]
}

export async function createDoctor(nombre: string, categoria: DoctorCategoria) {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return { error: 'No autenticado' }
  const { error } = await supabase.from('doctors').insert({
    profile_id: uid,
    nombre: nombre.trim(),
    categoria,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function updateDoctor(id: string, data: { nombre?: string; categoria?: DoctorCategoria; activo?: boolean }) {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return { error: 'No autenticado' }
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.nombre    !== undefined) update.nombre    = data.nombre.trim()
  if (data.categoria !== undefined) update.categoria = data.categoria
  if (data.activo    !== undefined) update.activo    = data.activo
  const { error } = await supabase.from('doctors').update(update).eq('id', id).eq('profile_id', uid)
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteDoctor(id: string) {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return { error: 'No autenticado' }
  const { error } = await supabase.from('doctors').delete().eq('id', id).eq('profile_id', uid)
  if (error) return { error: error.message }
  return { success: true }
}
