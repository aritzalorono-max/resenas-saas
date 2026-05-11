// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from './auth'
import { type DoctorCategoria, type DoctorProfile, type ShiftCounters } from '@/types'

async function getActiveTeamId(): Promise<string | null> {
  const profile = await getCurrentProfile()
  return profile?.active_team_id ?? null
}

export async function listDoctors(): Promise<DoctorProfile[]> {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  if (!teamId) return []
  const { data } = await supabase
    .from('guardias_doctor_profiles')
    .select('*, profile:guardias_profiles(id, full_name, role, avatar_url, active_team_id, created_at, updated_at)')
    .eq('team_id', teamId)
    .order('created_at')
  return (data as DoctorProfile[]) ?? []
}

export async function getDoctorProfile(profileId: string): Promise<DoctorProfile | null> {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  if (!teamId) return null
  const { data } = await supabase
    .from('guardias_doctor_profiles')
    .select('*, profile:guardias_profiles(id, full_name, role, avatar_url, active_team_id, created_at, updated_at)')
    .eq('profile_id', profileId)
    .eq('team_id', teamId)
    .single()
  return data as DoctorProfile | null
}

export async function createDoctorProfile(data: {
  profileId?: string | null
  nombre?: string
  categoria: DoctorCategoria
  especialidad?: string
  anioInicio?: number
  jornadaCompleta?: boolean
  reduccionPorcentaje?: number | null
  reduccionFechaInicio?: string | null
  reduccionFechaFin?: string | null
  notas?: string
}) {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  if (!teamId) return { error: 'No hay equipo activo.' }
  const { error } = await supabase.from('guardias_doctor_profiles').insert({
    profile_id:             data.profileId ?? null,
    nombre:                 data.nombre ?? null,
    team_id:                teamId,
    categoria:              data.categoria,
    especialidad:           data.especialidad ?? 'Urología',
    anio_inicio:            data.anioInicio ?? null,
    jornada_completa:       data.jornadaCompleta ?? true,
    reduccion_porcentaje:   data.reduccionPorcentaje ?? null,
    reduccion_fecha_inicio: data.reduccionFechaInicio ?? null,
    reduccion_fecha_fin:    data.reduccionFechaFin ?? null,
    notas:                  data.notas ?? null,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function updateDoctorProfile(id: string, data: {
  nombre?: string | null
  categoria?: DoctorCategoria
  especialidad?: string
  anioInicio?: number | null
  activo?: boolean
  jornadaCompleta?: boolean
  reduccionPorcentaje?: number | null
  reduccionFechaInicio?: string | null
  reduccionFechaFin?: string | null
  notas?: string | null
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('guardias_doctor_profiles')
    .update({
      ...(data.nombre                !== undefined && { nombre:                 data.nombre }),
      ...(data.categoria             !== undefined && { categoria:              data.categoria }),
      ...(data.especialidad          !== undefined && { especialidad:           data.especialidad }),
      ...(data.anioInicio            !== undefined && { anio_inicio:            data.anioInicio }),
      ...(data.activo                !== undefined && { activo:                 data.activo }),
      ...(data.jornadaCompleta       !== undefined && { jornada_completa:       data.jornadaCompleta }),
      ...(data.reduccionPorcentaje   !== undefined && { reduccion_porcentaje:   data.reduccionPorcentaje }),
      ...(data.reduccionFechaInicio  !== undefined && { reduccion_fecha_inicio: data.reduccionFechaInicio }),
      ...(data.reduccionFechaFin     !== undefined && { reduccion_fecha_fin:    data.reduccionFechaFin }),
      ...(data.notas                 !== undefined && { notas:                  data.notas }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function getShiftCounters(profileId: string, anio: number): Promise<ShiftCounters | null> {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  if (!teamId) return null
  const { data } = await supabase
    .from('guardias_shift_counters')
    .select('*')
    .eq('profile_id', profileId)
    .eq('team_id', teamId)
    .eq('anio', anio)
    .single()
  return data
}

export async function listAllShiftCounters(anio: number): Promise<ShiftCounters[]> {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  if (!teamId) return []
  const { data } = await supabase
    .from('guardias_shift_counters')
    .select('*')
    .eq('team_id', teamId)
    .eq('anio', anio)
  return data ?? []
}

export async function upsertShiftCounters(profileId: string, anio: number, counters: Partial<Omit<ShiftCounters, 'id' | 'profile_id' | 'anio' | 'updated_at'>>) {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  if (!teamId) return { error: 'No hay equipo activo.' }
  const { error } = await supabase
    .from('guardias_shift_counters')
    .upsert({
      profile_id: profileId,
      team_id:    teamId,
      anio,
      ...counters,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'profile_id,anio,team_id' })
  if (error) return { error: error.message }
  return { success: true }
}
