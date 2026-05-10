// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from './auth'
import { type Holiday, type HolidayTipo, type SpecialDay } from '@/types'

async function getActiveTeamId() {
  const profile = await getCurrentProfile()
  return profile?.active_team_id ?? null
}

export async function listHolidays(anio?: number): Promise<Holiday[]> {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  let query = supabase.from('guardias_holidays').select('*').order('fecha')
  if (teamId) query = query.eq('team_id', teamId)
  if (anio) query = query.gte('fecha', `${anio}-01-01`).lte('fecha', `${anio}-12-31`)
  const { data } = await query
  return data ?? []
}

export async function createHoliday(data: {
  nombre: string; fecha: string; tipo: HolidayTipo; esRecurrente?: boolean; notas?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const teamId = await getActiveTeamId()
  const { error } = await supabase.from('guardias_holidays').insert({
    nombre: data.nombre, fecha: data.fecha, tipo: data.tipo,
    es_recurrente: data.esRecurrente ?? false, notas: data.notas ?? null,
    created_by: user?.id ?? null, team_id: teamId,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function updateHoliday(id: string, data: {
  nombre?: string; fecha?: string; tipo?: HolidayTipo; esRecurrente?: boolean; notas?: string | null
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('guardias_holidays')
    .update({
      ...(data.nombre       !== undefined && { nombre:        data.nombre }),
      ...(data.fecha        !== undefined && { fecha:         data.fecha }),
      ...(data.tipo         !== undefined && { tipo:          data.tipo }),
      ...(data.esRecurrente !== undefined && { es_recurrente: data.esRecurrente }),
      ...(data.notas        !== undefined && { notas:         data.notas }),
    })
    .eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteHoliday(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('guardias_holidays').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function listSpecialDays(anio?: number): Promise<SpecialDay[]> {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  let query = supabase.from('guardias_special_days').select('*').order('fecha')
  if (teamId) query = query.eq('team_id', teamId)
  if (anio) query = query.gte('fecha', `${anio}-01-01`).lte('fecha', `${anio}-12-31`)
  const { data } = await query
  return data ?? []
}

export async function createSpecialDay(data: {
  fecha: string; tipoOverride: 'puente' | 'vispera' | 'festivo_especial'; motivo?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const teamId = await getActiveTeamId()
  const { error } = await supabase.from('guardias_special_days').insert({
    fecha: data.fecha, tipo_override: data.tipoOverride,
    motivo: data.motivo ?? null, created_by: user?.id ?? null, team_id: teamId,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteSpecialDay(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('guardias_special_days').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}
