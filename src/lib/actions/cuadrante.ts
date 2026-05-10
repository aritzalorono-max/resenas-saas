// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from './auth'
import { type DraftAssignment, type RulesConfig } from '@/types'

async function getActiveTeamId() {
  const profile = await getCurrentProfile()
  return profile?.active_team_id ?? null
}

// ─── Rules config ─────────────────────────────────────────────────────────────

export async function getRulesConfig(): Promise<RulesConfig | null> {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  const query = supabase.from('guardias_rules_config').select('*').limit(1)
  if (teamId) query.eq('team_id', teamId)
  const { data } = await query.single()
  return data ?? null
}

export async function updateRulesConfig(config: Partial<Omit<RulesConfig, 'id' | 'updated_at' | 'updated_by'>>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: existing } = await supabase
    .from('guardias_rules_config')
    .select('id')
    .limit(1)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('guardias_rules_config')
      .update({ ...config, updated_at: new Date().toISOString(), updated_by: user?.id ?? null })
      .eq('id', existing.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('guardias_rules_config')
      .insert({ ...config, updated_by: user?.id ?? null })
    if (error) return { error: error.message }
  }
  return { success: true }
}

// ─── Assignments CRUD ─────────────────────────────────────────────────────────

export async function listAssignments(fechaInicio: string, fechaFin: string) {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  let query = supabase.from('guardias_assignments').select('*').gte('fecha', fechaInicio).lte('fecha', fechaFin).order('fecha')
  if (teamId) query = query.eq('team_id', teamId)
  const { data, error } = await query
  if (error) return { error: error.message, data: [] }
  return { data: data ?? [], error: null }
}

export async function saveAssignments(
  assignments: { fecha: string; profile_id: string; tipo_dia: string; puntos: number }[],
  fechaInicio: string,
  fechaFin: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Delete existing assignments in range
  const { error: delError } = await supabase
    .from('guardias_assignments')
    .delete()
    .gte('fecha', fechaInicio)
    .lte('fecha', fechaFin)
  if (delError) return { error: delError.message }

  // Insert new assignments
  const teamId = await getActiveTeamId()
  const rows = assignments.map(a => ({
    ...a,
    team_id:    teamId,
    created_by: user?.id ?? null,
    updated_by: user?.id ?? null,
  }))
  const { error: insError } = await supabase
    .from('guardias_assignments')
    .insert(rows)
  if (insError) return { error: insError.message }

  // Recalculate shift counters for all affected doctors
  await recalcCountersForRange(fechaInicio, fechaFin)

  return { success: true }
}

export async function updateSingleAssignment(fecha: string, newProfileId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get day classification to know the points
  const { data: dayData } = await supabase
    .from('guardias_day_classifications')
    .select('tipo_dia')
    .eq('fecha', fecha)
    .single()

  const tipoDia = dayData?.tipo_dia ?? 'laborable'

  // Get points for this day type
  const { data: penosidad } = await supabase
    .from('guardias_penosidad_config')
    .select('puntos_base')
    .eq('tipo_dia', tipoDia)
    .single()

  const puntos = penosidad?.puntos_base ?? 1.0

  const { error } = await supabase
    .from('guardias_assignments')
    .update({
      profile_id: newProfileId,
      tipo_dia: tipoDia,
      puntos,
      updated_at: new Date().toISOString(),
      updated_by: user?.id ?? null,
    })
    .eq('fecha', fecha)
  if (error) return { error: error.message }

  // Recalculate counters for the year containing this date
  const year = fecha.substring(0, 4)
  await recalcCountersForRange(`${year}-01-01`, `${year}-12-31`)

  return { success: true }
}

// ─── Algorithm ────────────────────────────────────────────────────────────────

export async function generateCuadrante(
  fechaInicio: string,
  fechaFin: string
): Promise<{ assignments: DraftAssignment[]; error?: string }> {
  const supabase = await createClient()

  // 1. Rules config
  const { data: rules } = await supabase
    .from('guardias_rules_config')
    .select('*')
    .limit(1)
    .single()

  const descansoActivo = rules?.descanso_activo ?? true
  const maxMesActivo   = rules?.max_guardias_mes_activo ?? true
  const maxMes         = rules?.max_guardias_mes ?? 8

  const teamId = await getActiveTeamId()

  // 2. Active doctors with profiles
  let doctorQuery = supabase
    .from('guardias_doctor_profiles')
    .select('id, profile_id, profile:guardias_profiles(id, full_name)')
    .eq('activo', true)
  if (teamId) doctorQuery = doctorQuery.eq('team_id', teamId)
  const { data: doctors, error: docError } = await doctorQuery

  if (docError || !doctors?.length) {
    return { assignments: [], error: 'No hay médicos activos registrados.' }
  }

  // 3. Day classifications for the range
  const { data: days, error: dayError } = await supabase
    .from('guardias_day_classifications')
    .select('fecha, tipo_dia')
    .gte('fecha', fechaInicio)
    .lte('fecha', fechaFin)
    .order('fecha')

  if (dayError || !days?.length) {
    return { assignments: [], error: 'No se pudieron obtener las clasificaciones de días.' }
  }

  // 4. Penosidad config for points lookup
  const { data: penosidadRows } = await supabase
    .from('guardias_penosidad_config')
    .select('tipo_dia, puntos_base')

  const penosidadMap: Record<string, number> = {}
  for (const p of penosidadRows ?? []) {
    penosidadMap[p.tipo_dia] = p.puntos_base
  }

  // 5. Accumulated points for the year (from DB counters)
  const year = fechaInicio.substring(0, 4)
  const { data: counters } = await supabase
    .from('guardias_shift_counters')
    .select('profile_id, puntos_acumulados, total_guardias')
    .eq('anio', parseInt(year))

  const basePoints: Record<string, number> = {}
  const baseTotal:  Record<string, number> = {}
  for (const c of counters ?? []) {
    basePoints[c.profile_id] = c.puntos_acumulados ?? 0
    baseTotal[c.profile_id]  = c.total_guardias    ?? 0
  }

  // 6. Existing assignments OUTSIDE range (for boundary rest checks)
  const prevDate = new Date(fechaInicio)
  prevDate.setDate(prevDate.getDate() - 1)
  const prevDateStr = prevDate.toISOString().substring(0, 10)

  const { data: prevAssignments } = await supabase
    .from('guardias_assignments')
    .select('fecha, profile_id')
    .gte('fecha', `${year}-01-01`)
    .lte('fecha', prevDateStr)

  // 7. Run the algorithm
  // Running state (in-memory additions on top of DB counters)
  const runPoints: Record<string, number>         = { ...basePoints }
  const runMonthly: Record<string, Record<string, number>> = {}
  const lastShift: Record<string, string>         = {}

  // Seed lastShift from previous assignments
  for (const pa of prevAssignments ?? []) {
    const existing = lastShift[pa.profile_id]
    if (!existing || pa.fecha > existing) {
      lastShift[pa.profile_id] = pa.fecha
    }
  }

  // Seed monthly from DB counters (only for months BEFORE fechaInicio)
  // We'll only track months within the range in runMonthly
  const assignments: DraftAssignment[] = []

  for (const day of days) {
    const fecha   = day.fecha as string
    const tipoDia = day.tipo_dia as string
    const puntos  = penosidadMap[tipoDia] ?? 1.0
    const month   = fecha.substring(0, 7) // YYYY-MM

    // Build eligible set
    let eligible = doctors.filter(doc => {
      const pid = doc.profile_id

      // Rest rule: no shift the previous calendar day
      if (descansoActivo) {
        const prev = new Date(fecha)
        prev.setDate(prev.getDate() - 1)
        const prevStr = prev.toISOString().substring(0, 10)
        if (lastShift[pid] === prevStr) return false
      }

      // Max monthly shifts rule
      if (maxMesActivo) {
        const monthlyCount = (runMonthly[pid]?.[month] ?? 0)
        if (monthlyCount >= maxMes) return false
      }

      return true
    })

    // Fallback: if all are excluded by rules, ignore rules to avoid empty days
    if (!eligible.length) {
      eligible = [...doctors]
    }

    // Sort by accumulated points (lowest first)
    eligible.sort((a, b) => {
      const pa = runPoints[a.profile_id] ?? 0
      const pb = runPoints[b.profile_id] ?? 0
      return pa - pb
    })

    const chosen = eligible[0]
    const pid    = chosen.profile_id
    const name   = (chosen.profile as any)?.full_name ?? 'Desconocido'

    // Update running state
    runPoints[pid] = (runPoints[pid] ?? 0) + puntos
    runMonthly[pid] = runMonthly[pid] ?? {}
    runMonthly[pid][month] = (runMonthly[pid][month] ?? 0) + 1
    lastShift[pid] = fecha

    assignments.push({ fecha, profile_id: pid, tipo_dia: tipoDia as any, puntos, doctor_name: name })
  }

  return { assignments }
}

// ─── Internal: recalculate shift counters ────────────────────────────────────

async function recalcCountersForRange(fechaInicio: string, fechaFin: string) {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()

  const year = parseInt(fechaInicio.substring(0, 4))

  // Get all assignments for the full year
  let assignQuery = supabase
    .from('guardias_assignments')
    .select('profile_id, tipo_dia, puntos')
    .gte('fecha', `${year}-01-01`)
    .lte('fecha', `${year}-12-31`)
  if (teamId) assignQuery = assignQuery.eq('team_id', teamId)
  const { data: allAssignments } = await assignQuery

  if (!allAssignments?.length) return

  // Aggregate per doctor
  const agg: Record<string, {
    total_guardias: number
    guardias_laborable: number
    guardias_sabado: number
    guardias_domingo: number
    guardias_festivo: number
    guardias_vispera: number
    guardias_puente: number
    guardias_festivo_especial: number
    puntos_acumulados: number
  }> = {}

  for (const a of allAssignments) {
    if (!agg[a.profile_id]) {
      agg[a.profile_id] = {
        total_guardias: 0, guardias_laborable: 0, guardias_sabado: 0,
        guardias_domingo: 0, guardias_festivo: 0, guardias_vispera: 0,
        guardias_puente: 0, guardias_festivo_especial: 0, puntos_acumulados: 0,
      }
    }
    const d = agg[a.profile_id]
    d.total_guardias++
    d.puntos_acumulados += a.puntos ?? 0
    const key = `guardias_${a.tipo_dia}` as keyof typeof d
    if (key in d) (d[key] as number)++
  }

  // Upsert counters
  const rows = Object.entries(agg).map(([profile_id, counters]) => ({
    profile_id,
    anio: year,
    team_id: teamId,
    ...counters,
    puntos_acumulados: Math.round(counters.puntos_acumulados * 100) / 100,
    updated_at: new Date().toISOString(),
  }))

  await supabase
    .from('guardias_shift_counters')
    .upsert(rows, { onConflict: 'profile_id,anio' })
}
