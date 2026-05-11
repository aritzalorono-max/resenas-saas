'use client'

import { useState, useTransition } from 'react'
import {
  CalendarDays, RefreshCw, Save, Settings, ChevronDown,
  ChevronUp, AlertCircle, CheckCircle, Loader2,
} from 'lucide-react'
import {
  generateCuadrante,
  saveAssignments,
  updateSingleAssignment,
  updateRulesConfig,
  listAssignments,
} from '@/lib/actions/cuadrante'
import type { DraftAssignment, DoctorProfile, RulesConfig, UserRole } from '@/types'

const DAY_TIPO_LABELS: Record<string, string> = {
  festivo_especial: 'F. Especial',
  festivo:          'Festivo',
  domingo:          'Domingo',
  puente:           'Puente',
  sabado:           'Sábado',
  vispera:          'Víspera',
  laborable:        'Laborable',
}

const DAY_TIPO_COLORS: Record<string, string> = {
  festivo_especial: 'bg-red-100 text-red-700',
  festivo:          'bg-orange-100 text-orange-700',
  domingo:          'bg-yellow-100 text-yellow-700',
  puente:           'bg-amber-100 text-amber-700',
  sabado:           'bg-lime-100 text-lime-700',
  vispera:          'bg-emerald-100 text-emerald-700',
  laborable:        'bg-blue-50 text-blue-700',
}

const WEEKDAY_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTH_ES   = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const wd = WEEKDAY_ES[d.getDay()]
  const day = d.getDate()
  const mon = MONTH_ES[d.getMonth()]
  return `${wd} ${day} ${mon}`
}

function getDefaultRange() {
  const today = new Date()
  const y = today.getFullYear()
  const m = today.getMonth()
  const first = new Date(y, m + 1, 1)
  const last  = new Date(y, m + 2, 0)
  return {
    inicio: first.toISOString().substring(0, 10),
    fin:    last.toISOString().substring(0, 10),
  }
}

interface Props {
  currentRole: UserRole
  activeDoctors: DoctorProfile[]
  initialRules: RulesConfig | null
}

export function CuadranteClient({ currentRole, activeDoctors, initialRules }: Props) {
  const canEdit = currentRole === 'admin' || currentRole === 'gestor'
  const defaultRange = getDefaultRange()

  const [fechaInicio, setFechaInicio] = useState(defaultRange.inicio)
  const [fechaFin,    setFechaFin]    = useState(defaultRange.fin)

  const [draft,    setDraft]    = useState<DraftAssignment[]>([])
  const [saved,    setSaved]    = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [message,  setMessage]  = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const [showRules, setShowRules] = useState(false)
  const [rules, setRules]         = useState<RulesConfig | null>(initialRules)
  const [rulesDirty, setRulesDirty] = useState(false)

  const [, startTransition] = useTransition()

  // ── Preset buttons ──────────────────────────────────────────────────────────
  function applyPreset(preset: 'week' | 'month' | 'next_month' | 'quarter') {
    const today = new Date()
    const y = today.getFullYear()
    const m = today.getMonth()

    if (preset === 'week') {
      const monday = new Date(today)
      const day = today.getDay()
      const diff = day === 0 ? -6 : 1 - day
      monday.setDate(today.getDate() + diff + 7)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      setFechaInicio(monday.toISOString().substring(0, 10))
      setFechaFin(sunday.toISOString().substring(0, 10))
    } else if (preset === 'month') {
      const first = new Date(y, m, 1)
      const last  = new Date(y, m + 1, 0)
      setFechaInicio(first.toISOString().substring(0, 10))
      setFechaFin(last.toISOString().substring(0, 10))
    } else if (preset === 'next_month') {
      const first = new Date(y, m + 1, 1)
      const last  = new Date(y, m + 2, 0)
      setFechaInicio(first.toISOString().substring(0, 10))
      setFechaFin(last.toISOString().substring(0, 10))
    } else if (preset === 'quarter') {
      const qStart = Math.floor(m / 3) * 3
      const first  = new Date(y, qStart + 3, 1)
      const last   = new Date(y, qStart + 6, 0)
      setFechaInicio(first.toISOString().substring(0, 10))
      setFechaFin(last.toISOString().substring(0, 10))
    }
    setDraft([])
    setSaved(false)
    setMessage(null)
  }

  // ── Load existing ────────────────────────────────────────────────────────────
  async function handleLoadExisting() {
    setLoading(true)
    setMessage(null)
    const { data, error } = await listAssignments(fechaInicio, fechaFin)
    if (error) {
      setMessage({ type: 'err', text: error })
    } else if (!data.length) {
      setMessage({ type: 'err', text: 'No hay cuadrante guardado para ese período.' })
    } else {
      const profileMap: Record<string, string> = {}
      for (const d of activeDoctors) {
        if (d.profile_id) profileMap[d.profile_id] = d.profile?.full_name ?? 'Sin nombre'
      }
      const mapped: DraftAssignment[] = data.map((a: any) => ({
        fecha:      a.fecha,
        profile_id: a.profile_id,
        tipo_dia:   a.tipo_dia,
        puntos:     a.puntos,
        doctor_name: profileMap[a.profile_id] ?? 'Desconocido',
      }))
      setDraft(mapped)
      setSaved(true)
    }
    setLoading(false)
  }

  // ── Generate ─────────────────────────────────────────────────────────────────
  async function handleGenerate() {
    if (!canEdit) return
    setLoading(true)
    setMessage(null)
    setSaved(false)
    const { assignments, error } = await generateCuadrante(fechaInicio, fechaFin)
    if (error) {
      setMessage({ type: 'err', text: error })
    } else {
      setDraft(assignments)
      setMessage({ type: 'ok', text: `Cuadrante generado: ${assignments.length} días. Revisa y guarda.` })
    }
    setLoading(false)
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!canEdit || !draft.length) return
    setLoading(true)
    setMessage(null)
    const { error } = await saveAssignments(draft, fechaInicio, fechaFin)
    if (error) {
      setMessage({ type: 'err', text: error })
    } else {
      setSaved(true)
      setMessage({ type: 'ok', text: 'Cuadrante guardado. Contadores de carga actualizados.' })
    }
    setLoading(false)
  }

  // ── Manual change ─────────────────────────────────────────────────────────────
  async function handleChangeDoctor(fecha: string, newProfileId: string) {
    if (!canEdit) return
    const profileMap: Record<string, string> = {}
    for (const d of activeDoctors) {
      if (d.profile_id) profileMap[d.profile_id] = d.profile?.full_name ?? 'Sin nombre'
    }
    const newName = profileMap[newProfileId] ?? 'Desconocido'

    // Optimistic UI update
    setDraft(prev => prev.map(a =>
      a.fecha === fecha ? { ...a, profile_id: newProfileId, doctor_name: newName } : a
    ))

    // If saved, persist immediately
    if (saved) {
      const { error } = await updateSingleAssignment(fecha, newProfileId)
      if (error) {
        setMessage({ type: 'err', text: `Error al guardar cambio: ${error}` })
      } else {
        setMessage({ type: 'ok', text: `Guardia del ${formatDate(fecha)} reasignada.` })
      }
    } else {
      setSaved(false)
      setMessage({ type: 'ok', text: 'Cambio aplicado. Recuerda guardar el cuadrante.' })
    }
  }

  // ── Save rules ────────────────────────────────────────────────────────────────
  async function handleSaveRules() {
    if (!rules || !canEdit) return
    setLoading(true)
    const { error } = await updateRulesConfig({
      descanso_minimo_horas:   rules.descanso_minimo_horas,
      descanso_activo:          rules.descanso_activo,
      max_guardias_mes:         rules.max_guardias_mes,
      max_guardias_mes_activo:  rules.max_guardias_mes_activo,
    })
    if (error) {
      setMessage({ type: 'err', text: `Error al guardar reglas: ${error}` })
    } else {
      setRulesDirty(false)
      setMessage({ type: 'ok', text: 'Reglas actualizadas.' })
    }
    setLoading(false)
  }

  function updateRule(key: keyof RulesConfig, value: any) {
    setRules(prev => prev ? { ...prev, [key]: value } : prev)
    setRulesDirty(true)
  }

  // ── Summary stats ─────────────────────────────────────────────────────────────
  const doctorStats: Record<string, { name: string; count: number; puntos: number }> = {}
  for (const a of draft) {
    if (!doctorStats[a.profile_id]) {
      doctorStats[a.profile_id] = { name: a.doctor_name, count: 0, puntos: 0 }
    }
    doctorStats[a.profile_id].count++
    doctorStats[a.profile_id].puntos += a.puntos
  }
  const stats = Object.values(doctorStats).sort((a, b) => b.puntos - a.puntos)

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays size={24} className="text-blue-600" />
            Cuadrante de Guardias
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Genera y gestiona el calendario de guardias por período
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowRules(r => !r)}
            className="btn-secondary flex items-center gap-2"
          >
            <Settings size={16} />
            Reglas
            {showRules ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {/* Rules panel */}
      {showRules && rules && canEdit && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Reglas de asignación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rest rule */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-700">Descanso mínimo</p>
                  <p className="text-xs text-gray-500">No asignar dos días consecutivos al mismo médico</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateRule('descanso_activo', !rules.descanso_activo)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    rules.descanso_activo ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    rules.descanso_activo ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              {rules.descanso_activo && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">Horas mínimas:</label>
                  <input
                    type="number"
                    min={8}
                    max={48}
                    value={rules.descanso_minimo_horas}
                    onChange={e => updateRule('descanso_minimo_horas', parseInt(e.target.value))}
                    className="input w-20"
                  />
                </div>
              )}
            </div>

            {/* Max monthly rule */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-700">Máximo guardias/mes</p>
                  <p className="text-xs text-gray-500">Límite de guardias por médico en el mes</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateRule('max_guardias_mes_activo', !rules.max_guardias_mes_activo)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    rules.max_guardias_mes_activo ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    rules.max_guardias_mes_activo ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              {rules.max_guardias_mes_activo && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">Máximo guardias:</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={rules.max_guardias_mes}
                    onChange={e => updateRule('max_guardias_mes', parseInt(e.target.value))}
                    className="input w-20"
                  />
                </div>
              )}
            </div>
          </div>

          {rulesDirty && (
            <div className="flex justify-end">
              <button onClick={handleSaveRules} disabled={loading} className="btn-primary">
                Guardar reglas
              </button>
            </div>
          )}
        </div>
      )}

      {/* Period selector */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-gray-800">Período de asignación</h2>

        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Próxima semana', preset: 'week' as const },
            { label: 'Este mes',       preset: 'month' as const },
            { label: 'Próximo mes',    preset: 'next_month' as const },
            { label: 'Próximo trimestre', preset: 'quarter' as const },
          ].map(({ label, preset }) => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className="btn-secondary text-sm"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Date inputs */}
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="label">Desde</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => { setFechaInicio(e.target.value); setDraft([]); setSaved(false) }}
              className="input"
            />
          </div>
          <div>
            <label className="label">Hasta</label>
            <input
              type="date"
              value={fechaFin}
              onChange={e => { setFechaFin(e.target.value); setDraft([]); setSaved(false) }}
              className="input"
            />
          </div>

          <div className="flex gap-2 pb-0.5">
            <button
              onClick={handleLoadExisting}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CalendarDays size={16} />}
              Ver guardado
            </button>
            {canEdit && (
              <button
                onClick={handleGenerate}
                disabled={loading || !activeDoctors.length}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                Generar cuadrante
              </button>
            )}
          </div>
        </div>

        {!activeDoctors.length && (
          <p className="text-sm text-amber-600 flex items-center gap-1">
            <AlertCircle size={14} />
            No hay médicos activos. Añade médicos primero.
          </p>
        )}
      </div>

      {/* Feedback message */}
      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'ok'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'ok'
            ? <CheckCircle size={16} />
            : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Draft grid */}
      {draft.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">Resumen del período</h2>
              {canEdit && !saved && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Guardar cuadrante
                </button>
              )}
              {saved && (
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} />
                  Guardado
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="table-th">Médico</th>
                    <th className="table-th text-center">Guardias</th>
                    <th className="table-th text-center">Puntos período</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map(s => (
                    <tr key={s.name} className="border-t border-gray-100">
                      <td className="table-td font-medium">{s.name}</td>
                      <td className="table-td text-center">{s.count}</td>
                      <td className="table-td text-center">{s.puntos.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Day-by-day grid */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">
                Cuadrante detallado
                {saved && <span className="ml-2 text-xs text-gray-400">(guardado)</span>}
                {!saved && <span className="ml-2 text-xs text-amber-500">(borrador — no guardado)</span>}
              </h2>
              {canEdit && !saved && draft.length > 0 && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Guardar
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-th">Día</th>
                    <th className="table-th">Tipo</th>
                    <th className="table-th">Pts</th>
                    <th className="table-th">Médico de guardia</th>
                  </tr>
                </thead>
                <tbody>
                  {draft.map(a => (
                    <tr key={a.fecha} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="table-td font-medium whitespace-nowrap">
                        {formatDate(a.fecha)}
                      </td>
                      <td className="table-td">
                        <span className={`badge text-xs ${DAY_TIPO_COLORS[a.tipo_dia] ?? 'bg-gray-100 text-gray-600'}`}>
                          {DAY_TIPO_LABELS[a.tipo_dia] ?? a.tipo_dia}
                        </span>
                      </td>
                      <td className="table-td text-center tabular-nums">
                        {a.puntos.toFixed(2)}
                      </td>
                      <td className="table-td">
                        {canEdit ? (
                          <select
                            value={a.profile_id}
                            onChange={e => handleChangeDoctor(a.fecha, e.target.value)}
                            className="input py-1 text-sm max-w-[220px]"
                          >
                            {activeDoctors.filter(d => d.profile_id).map(d => (
                              <option key={d.profile_id!} value={d.profile_id!}>
                                {d.profile?.full_name ?? d.nombre ?? 'Sin nombre'}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{a.doctor_name}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save button at bottom */}
          {canEdit && !saved && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Guardar cuadrante
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!draft.length && !loading && (
        <div className="card text-center py-12">
          <CalendarDays size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            {canEdit
              ? 'Selecciona un período y pulsa "Generar cuadrante" para crear el reparto automático'
              : 'Selecciona un período y pulsa "Ver guardado" para consultar el cuadrante'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            El algoritmo asigna médicos por equidad según la carga acumulada del año
          </p>
        </div>
      )}
    </div>
  )
}
