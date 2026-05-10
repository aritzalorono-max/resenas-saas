// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { type ExtraTipo, type AbsenciaTipo, type Extra, type Absence } from '@/types'

// ─── Extras ──────────────────────────────────────────────────────────────────

export async function listExtras(profileId: string, anio: number): Promise<Extra[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guardias_extras')
    .select('*')
    .eq('profile_id', profileId)
    .gte('fecha', `${anio}-01-01`)
    .lte('fecha', `${anio}-12-31`)
    .order('fecha', { ascending: false })
  return data ?? []
}

export async function addExtra(data: {
  profileId: string
  fecha: string
  tipo: ExtraTipo
  descripcion?: string
  horas?: number
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('guardias_extras').insert({
    profile_id:  data.profileId,
    fecha:       data.fecha,
    tipo:        data.tipo,
    descripcion: data.descripcion ?? null,
    horas:       data.horas ?? 0,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteExtra(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('guardias_extras').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

// ─── Absences ─────────────────────────────────────────────────────────────────

export async function listAbsences(profileId: string, anio: number): Promise<Absence[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guardias_absences')
    .select('*')
    .eq('profile_id', profileId)
    .gte('fecha_inicio', `${anio}-01-01`)
    .lte('fecha_fin', `${anio}-12-31`)
    .order('fecha_inicio', { ascending: false })
  return data ?? []
}

export async function addAbsence(data: {
  profileId: string
  fechaInicio: string
  fechaFin: string
  tipo: AbsenciaTipo
  motivo?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('guardias_absences').insert({
    profile_id:  data.profileId,
    fecha_inicio: data.fechaInicio,
    fecha_fin:    data.fechaFin,
    tipo:         data.tipo,
    motivo:       data.motivo ?? null,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteAbsence(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('guardias_absences').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}
