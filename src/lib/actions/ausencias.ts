'use server'

import { createClient } from '@/lib/supabase/server'
import { type TipoAusencia, type Ausencia } from '@/types'

async function getUid(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function listAusencias(doctorId: string): Promise<Ausencia[]> {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return []
  const { data } = await supabase
    .from('ausencias')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('profile_id', uid)
    .order('fecha')
  return (data ?? []) as Ausencia[]
}

export async function setAusencia(doctorId: string, fecha: string, tipo: TipoAusencia) {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return { error: 'No autenticado' }
  const { error } = await supabase.from('ausencias').upsert(
    { profile_id: uid, doctor_id: doctorId, fecha, tipo },
    { onConflict: 'doctor_id,fecha' }
  )
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteAusencia(doctorId: string, fecha: string) {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return { error: 'No autenticado' }
  const { error } = await supabase
    .from('ausencias')
    .delete()
    .eq('doctor_id', doctorId)
    .eq('fecha', fecha)
    .eq('profile_id', uid)
  if (error) return { error: error.message }
  return { success: true }
}
