'use server'

import { createClient } from '@/lib/supabase/server'
import { type JornadaPeriodo } from '@/types'

async function getUid(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function listJornada(doctorId: string): Promise<JornadaPeriodo[]> {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return []
  const { data } = await supabase
    .from('jornada_periodos')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('profile_id', uid)
    .order('fecha_inicio')
  return (data ?? []) as JornadaPeriodo[]
}

export async function createJornada(
  doctorId: string,
  jornadaCompleta: boolean,
  reduccionPorcentaje: number | null,
  fechaInicio: string,
  fechaFin: string | null,
) {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return { error: 'No autenticado' }
  const { error } = await supabase.from('jornada_periodos').insert({
    profile_id: uid,
    doctor_id: doctorId,
    jornada_completa: jornadaCompleta,
    reduccion_porcentaje: jornadaCompleta ? null : reduccionPorcentaje,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin || null,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteJornada(id: string) {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return { error: 'No autenticado' }
  const { error } = await supabase
    .from('jornada_periodos')
    .delete()
    .eq('id', id)
    .eq('profile_id', uid)
  if (error) return { error: error.message }
  return { success: true }
}
