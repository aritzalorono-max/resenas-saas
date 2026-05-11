'use server'

import { createClient } from '@/lib/supabase/server'
import { type TipoPeriodo, type Periodo } from '@/types'

async function getUid(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function listPeriodos(doctorId: string): Promise<Periodo[]> {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return []
  const { data } = await supabase
    .from('periodos')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('profile_id', uid)
    .order('fecha_inicio')
  return (data ?? []) as Periodo[]
}

export async function createPeriodo(
  doctorId: string,
  tipo: TipoPeriodo,
  fechaInicio: string,
  fechaFin: string,
) {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return { error: 'No autenticado' }
  const { error } = await supabase.from('periodos').insert({
    profile_id: uid,
    doctor_id: doctorId,
    tipo,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function deletePeriodo(id: string) {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return { error: 'No autenticado' }
  const { error } = await supabase
    .from('periodos')
    .delete()
    .eq('id', id)
    .eq('profile_id', uid)
  if (error) return { error: error.message }
  return { success: true }
}
