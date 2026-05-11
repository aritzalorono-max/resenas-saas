// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from './auth'
import { type DoctorCategoria, type DoctorProfile, type DoctorPeriodo, type PeriodoTipo, type ShiftCounters } from '@/types'

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
  email?: string | null
  categoria: DoctorCategoria
  especialidad?: string
  notas?: string
}) {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  if (!teamId) return { error: 'No hay equipo activo.' }
  const { error } = await supabase.from('guardias_doctor_profiles').insert({
    profile_id:  data.profileId ?? null,
    nombre:      data.nombre ?? null,
    email:       data.email ?? null,
    team_id:     teamId,
    categoria:   data.categoria,
    especialidad: data.especialidad ?? 'Urología',
    notas:       data.notas ?? null,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function updateDoctorProfile(id: string, data: {
  nombre?: string | null
  email?: string | null
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
      ...(data.email                 !== undefined && { email:                  data.email }),
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

// ─── Doctor Periodos ──────────────────────────────────────────────────────────

export async function listDoctorPeriodos(doctorProfileId: string): Promise<DoctorPeriodo[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guardias_doctor_periodos')
    .select('*')
    .eq('doctor_profile_id', doctorProfileId)
    .order('fecha_inicio')
  return (data ?? []) as DoctorPeriodo[]
}

export async function createDoctorPeriodo(data: {
  doctorProfileId: string
  tipo: PeriodoTipo
  fechaInicio: string
  fechaFin?: string | null
  reduccionPorcentaje?: number | null
  notas?: string | null
}) {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  if (!teamId) return { error: 'No hay equipo activo.' }
  const { error } = await supabase.from('guardias_doctor_periodos').insert({
    doctor_profile_id:    data.doctorProfileId,
    team_id:              teamId,
    tipo:                 data.tipo,
    fecha_inicio:         data.fechaInicio,
    fecha_fin:            data.fechaFin ?? null,
    reduccion_porcentaje: data.reduccionPorcentaje ?? null,
    notas:                data.notas ?? null,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function updateDoctorPeriodo(id: string, data: {
  tipo?: PeriodoTipo
  fechaInicio?: string
  fechaFin?: string | null
  reduccionPorcentaje?: number | null
  notas?: string | null
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('guardias_doctor_periodos')
    .update({
      ...(data.tipo                !== undefined && { tipo:                 data.tipo }),
      ...(data.fechaInicio         !== undefined && { fecha_inicio:         data.fechaInicio }),
      ...(data.fechaFin            !== undefined && { fecha_fin:            data.fechaFin }),
      ...(data.reduccionPorcentaje !== undefined && { reduccion_porcentaje: data.reduccionPorcentaje }),
      ...(data.notas               !== undefined && { notas:                data.notas }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteDoctorPeriodo(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('guardias_doctor_periodos').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}
