export type UserRole = 'admin' | 'gestor' | 'medico'

export type DoctorCategoria =
  | 'R1' | 'R2' | 'R3' | 'R4' | 'R5'
  | 'Adjunto' | 'Jefe_Seccion' | 'Jefe_Servicio'

export type HolidayTipo = 'nacional' | 'euskadi' | 'bizkaia' | 'galdakao' | 'especial'

export type DayTipo =
  | 'laborable' | 'sabado' | 'domingo'
  | 'festivo' | 'vispera' | 'puente' | 'festivo_especial'

export interface GuardiasProfile {
  id: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface DoctorProfile {
  id: string
  profile_id: string
  categoria: DoctorCategoria
  num_colegiado: string | null
  especialidad: string
  anio_inicio: number | null
  activo: boolean
  notas: string | null
  created_at: string
  updated_at: string
  profile?: GuardiasProfile
}

export interface ShiftCounters {
  id: string
  profile_id: string
  anio: number
  total_guardias: number
  guardias_laborable: number
  guardias_sabado: number
  guardias_domingo: number
  guardias_festivo: number
  guardias_vispera: number
  guardias_puente: number
  guardias_festivo_especial: number
  puntos_acumulados: number
  updated_at: string
}

export interface Holiday {
  id: string
  nombre: string
  fecha: string
  tipo: HolidayTipo
  es_recurrente: boolean
  notas: string | null
  created_at: string
  created_by: string | null
}

export interface SpecialDay {
  id: string
  fecha: string
  tipo_override: 'puente' | 'vispera' | 'festivo_especial'
  motivo: string | null
  created_at: string
  created_by: string | null
}

export interface PenosidadConfig {
  id: string
  tipo_dia: DayTipo
  nivel: number
  etiqueta: string
  descripcion: string | null
  color: string
  puntos_base: number
  updated_at: string
  updated_by: string | null
}

export interface DayClassification {
  fecha: string
  anio: number
  mes: number
  dia_semana: number
  tipo_dia: DayTipo
  nombre_festivo: string | null
  motivo_especial: string | null
}

export const CATEGORIA_LABELS: Record<DoctorCategoria, string> = {
  R1: 'Residente 1º año',
  R2: 'Residente 2º año',
  R3: 'Residente 3º año',
  R4: 'Residente 4º año',
  R5: 'Residente 5º año',
  Adjunto: 'Médico Adjunto',
  Jefe_Seccion: 'Jefe de Sección',
  Jefe_Servicio: 'Jefe de Servicio',
}

export const TIPO_LABELS: Record<HolidayTipo, string> = {
  nacional: 'Nacional',
  euskadi: 'Euskadi',
  bizkaia: 'Bizkaia',
  galdakao: 'Galdakao',
  especial: 'Especial',
}

export const TIPO_COLORS: Record<HolidayTipo, string> = {
  nacional:  'bg-blue-100 text-blue-800',
  euskadi:   'bg-red-100 text-red-800',
  bizkaia:   'bg-green-100 text-green-800',
  galdakao:  'bg-purple-100 text-purple-800',
  especial:  'bg-orange-100 text-orange-800',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin:  'Administrador',
  gestor: 'Gestor',
  medico: 'Médico',
}

export interface RulesConfig {
  id: string
  descanso_minimo_horas: number
  descanso_activo: boolean
  max_guardias_mes: number
  max_guardias_mes_activo: boolean
  updated_at: string
  updated_by: string | null
}

export interface Assignment {
  id: string
  fecha: string
  profile_id: string
  tipo_dia: DayTipo
  puntos: number
  notas: string | null
  created_at: string
  created_by: string | null
  updated_at: string
  updated_by: string | null
}

export type ExtraTipo = 'peonada' | 'autoconcierto' | 'guardia_localizada' | 'otro'
export type AbsenciaTipo = 'baja' | 'vacaciones' | 'asuntos_propios' | 'otro'

export interface Extra {
  id: string
  profile_id: string
  fecha: string
  tipo: ExtraTipo
  descripcion: string | null
  horas: number
  created_at: string
}

export interface Absence {
  id: string
  profile_id: string
  fecha_inicio: string
  fecha_fin: string
  tipo: AbsenciaTipo
  motivo: string | null
  created_at: string
}

export const EXTRA_LABELS: Record<ExtraTipo, string> = {
  peonada:          'Peonada',
  autoconcierto:    'Autoconcierto',
  guardia_localizada: 'Guardia localizada',
  otro:             'Otro',
}

export const ABSENCIA_LABELS: Record<AbsenciaTipo, string> = {
  baja:            'Baja médica',
  vacaciones:      'Vacaciones',
  asuntos_propios: 'Asuntos propios',
  otro:            'Otro',
}

export interface DraftAssignment {
  fecha: string
  profile_id: string
  tipo_dia: DayTipo
  puntos: number
  doctor_name: string
}
