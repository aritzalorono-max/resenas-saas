export interface Profile {
  id: string
  full_name: string | null
  hospital: string | null
  especialidad: string | null
  nombre_servicio: string | null
  created_at: string
  updated_at: string
}

export type DoctorCategoria = 'Adjunto' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5'

export interface Doctor {
  id: string
  profile_id: string
  nombre: string
  categoria: DoctorCategoria
  activo: boolean
  created_at: string
  updated_at: string
}

export const CATEGORIA_LABELS: Record<DoctorCategoria, string> = {
  Adjunto: 'Adjunto',
  R1: 'R1', R2: 'R2', R3: 'R3', R4: 'R4', R5: 'R5',
}

export const CATEGORIA_COLORS: Record<DoctorCategoria, string> = {
  Adjunto: 'bg-blue-100 text-blue-800',
  R1:      'bg-purple-100 text-purple-800',
  R2:      'bg-violet-100 text-violet-800',
  R3:      'bg-fuchsia-100 text-fuchsia-800',
  R4:      'bg-pink-100 text-pink-800',
  R5:      'bg-rose-100 text-rose-800',
}

export type TipoAusencia = 'Vacaciones' | 'Baja' | 'Excedencia' | 'Congreso' | 'Otros'

export interface Ausencia {
  id: string
  profile_id: string
  doctor_id: string
  fecha: string
  tipo: TipoAusencia
  created_at: string
}

export const TIPO_AUSENCIA_BG: Record<TipoAusencia, string> = {
  Vacaciones: 'bg-sky-500',
  Baja:       'bg-red-500',
  Excedencia: 'bg-amber-500',
  Congreso:   'bg-purple-500',
  Otros:      'bg-gray-400',
}
