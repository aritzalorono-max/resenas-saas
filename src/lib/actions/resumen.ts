'use server'

import { createClient } from '@/lib/supabase/server'
import { type Doctor, type TipoAusencia, type Periodo } from '@/types'

async function getUid(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export interface DiasAusencia {
  tipo: TipoAusencia
  fechas: string[]
}

export interface ResumenDoctor {
  doctor: Doctor
  ausencias: DiasAusencia[]
  periodos: Periodo[]
}

export async function getResumenMes(year: number, month: number): Promise<ResumenDoctor[]> {
  const supabase = await createClient()
  const uid = await getUid()
  if (!uid) return []

  const pad = (n: number) => String(n).padStart(2, '0')
  const mesStart = `${year}-${pad(month + 1)}-01`
  const lastDay = new Date(year, month + 1, 0).getDate()
  const mesEnd   = `${year}-${pad(month + 1)}-${pad(lastDay)}`

  const [{ data: doctors }, { data: ausencias }, { data: periodos }] = await Promise.all([
    supabase.from('doctors').select('*').eq('profile_id', uid).eq('activo', true).order('categoria').order('nombre'),
    supabase.from('ausencias').select('*').eq('profile_id', uid).gte('fecha', mesStart).lte('fecha', mesEnd),
    supabase.from('periodos').select('*').eq('profile_id', uid).lte('fecha_inicio', mesEnd).gte('fecha_fin', mesStart),
  ])

  return (doctors ?? []).map(doc => {
    const docAus = (ausencias ?? []).filter(a => a.doctor_id === doc.id)
    const docPer = (periodos  ?? []).filter(p => p.doctor_id === doc.id)

    const byTipo = new Map<TipoAusencia, string[]>()
    for (const a of docAus) {
      if (!byTipo.has(a.tipo)) byTipo.set(a.tipo, [])
      byTipo.get(a.tipo)!.push(a.fecha)
    }

    const ausList: DiasAusencia[] = [...byTipo.entries()]
      .map(([tipo, fechas]) => ({ tipo, fechas: fechas.sort() }))

    return { doctor: doc as Doctor, ausencias: ausList, periodos: docPer as Periodo[] }
  }).filter(r => r.ausencias.length > 0 || r.periodos.length > 0)
}
