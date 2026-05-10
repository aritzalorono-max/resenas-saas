// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from './auth'
import { type PenosidadConfig } from '@/types'

async function getActiveTeamId() {
  const profile = await getCurrentProfile()
  return profile?.active_team_id ?? null
}

export async function listPenosidadConfig(): Promise<PenosidadConfig[]> {
  const supabase = await createClient()
  const teamId = await getActiveTeamId()
  let query = supabase.from('guardias_penosidad_config').select('*').order('nivel')
  if (teamId) query = query.eq('team_id', teamId)
  const { data } = await query
  return data ?? []
}

export async function updatePenosidadLevels(updates: { id: string; nivel: number }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const results = await Promise.all(
    updates.map(({ id, nivel }) =>
      supabase.from('guardias_penosidad_config')
        .update({ nivel, updated_at: new Date().toISOString(), updated_by: user?.id })
        .eq('id', id)
    )
  )
  const error = results.find(r => r.error)?.error
  if (error) return { error: error.message }
  return { success: true }
}

export async function updatePenosidadItem(id: string, data: {
  etiqueta?: string; descripcion?: string | null; color?: string; puntos_base?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('guardias_penosidad_config')
    .update({ ...data, updated_at: new Date().toISOString(), updated_by: user?.id })
    .eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}
