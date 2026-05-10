'use client'

import { useState, useTransition } from 'react'
import {
  CalendarCheck, Clock, Umbrella, TrendingUp, Plus, Trash2,
  ChevronDown, ChevronUp, Calculator, FileText, AlertCircle,
  CheckCircle, Loader2, Activity,
} from 'lucide-react'
import { addExtra, deleteExtra, addAbsence, deleteAbsence } from '@/lib/actions/medico'
import type {
  ShiftCounters, DoctorProfile, Extra, Absence,
  ExtraTipo, AbsenciaTipo, DoctorCategoria,
} from '@/types'

// ─── Salary reference data (Osakidetza 2025, bruto estimado) ────────────────

const SALARIO_BASE: Record<DoctorCategoria, number> = {
  R1:              2_100,
  R2:              2_300,
  R3:              2_500,
  R4:              2_700,
  R5:              2_900,
  Adjunto:         3_800,
  Jefe_Seccion:    4_500,
  Jefe_Servicio:   5_200,
}

const GUARDIA_RATE: Record<string, number> = {
  laborable:        500,
  sabado:           580,
  domingo:          630,
  festivo:          660,
  vispera:          530,
  puente:           560,
  festivo_especial: 730,
}

const EXTRA_RATE: Record<ExtraTipo, number> = {
  peonada:           230,
  autoconcierto:     180,
  guardia_localizada: 85,
  otro:              150,
}

const EXTRA_LABELS: Record<ExtraTipo, string> = {
  peonada:           'Peonada',
  autoconcierto:     'Autoconcierto',
  guardia_localizada: 'Guardia localizada',
  otro:              'Otro',
}

const ABSENCIA_LABELS: Record<AbsenciaTipo, string> = {
  baja:            'Baja médica',
  vacaciones:      'Vacaciones',
  asuntos_propios: 'Asuntos propios',
  otro:            'Otro',
}

const ABSENCIA_COLORS: Record<AbsenciaTipo, string> = {
  baja:            'bg-red-100 text-red-700',
  vacaciones:      'bg-blue-100 text-blue-700',
  asuntos_propios: 'bg-purple-100 text-purple-700',
  otro:            'bg-gray-100 text-gray-600',
}

const EXTRA_COLORS: Record<ExtraTipo, string> = {
  peonada:           'bg-emerald-100 text-emerald-700',
  autoconcierto:     'bg-cyan-100 text-cyan-700',
  guardia_localizada: 'bg-amber-100 text-amber-700',
  otro:              'bg-gray-100 text-gray-600',
}

function absenceDays(a: Absence) {
  const d1 = new Date(a.fecha_inicio)
  const d2 = new Date(a.fecha_fin)
  return Math.round((d2.getTime() - d1.getTime()) / 86400000) + 1
}

function formatDate(s: string) {
  return new Date(s + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  profileId:   string
  fullName:    string
  doctor:      DoctorProfile | null
  counters:    ShiftCounters | null
  extras:      Extra[]
  absences:    Absence[]
  anio:        number
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MedicoDashboard({ profileId, fullName, doctor, counters, extras: initialExtras, absences: initialAbsences, anio }: Props) {
  const [tab, setTab]           = useState<'resumen' | 'extras' | 'calculadora'>('resumen')
  const [extras, setExtras]     = useState<Extra[]>(initialExtras)
  const [absences, setAbsences] = useState<Absence[]>(initialAbsences)
  const [message, setMessage]   = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [, startTransition]     = useTransition()

  // Extra form
  const [extraFecha, setExtraFecha]   = useState(new Date().toISOString().substring(0, 10))
  const [extraTipo,  setExtraTipo]    = useState<ExtraTipo>('peonada')
  const [extraDesc,  setExtraDesc]    = useState('')
  const [extraHoras, setExtraHoras]   = useState(0)
  const [addingExtra, setAddingExtra] = useState(false)

  // Absence form
  const [absInicio,  setAbsInicio]   = useState(new Date().toISOString().substring(0, 10))
  const [absFin,     setAbsFin]      = useState(new Date().toISOString().substring(0, 10))
  const [absTipo,    setAbsTipo]     = useState<AbsenciaTipo>('vacaciones')
  const [absMotivo,  setAbsMotivo]   = useState('')
  const [addingAbs,  setAddingAbs]   = useState(false)

  const categoria = doctor?.categoria ?? 'Adjunto'

  // ── Computed stats ──────────────────────────────────────────────────────────
  const totalGuardias = counters?.total_guardias ?? 0
  const totalPuntos   = Number(counters?.puntos_acumulados ?? 0)
  const totalBajaDias = absences
    .filter(a => a.tipo === 'baja')
    .reduce((s, a) => s + absenceDays(a), 0)
  const totalAusencias = absences.length

  // ── Salary calculation ──────────────────────────────────────────────────────
  const salarioBase = SALARIO_BASE[categoria as DoctorCategoria] ?? 3_800

  const guardiaTotal =
    (counters?.guardias_laborable        ?? 0) * GUARDIA_RATE.laborable +
    (counters?.guardias_sabado           ?? 0) * GUARDIA_RATE.sabado +
    (counters?.guardias_domingo          ?? 0) * GUARDIA_RATE.domingo +
    (counters?.guardias_festivo          ?? 0) * GUARDIA_RATE.festivo +
    (counters?.guardias_vispera          ?? 0) * GUARDIA_RATE.vispera +
    (counters?.guardias_puente           ?? 0) * GUARDIA_RATE.puente +
    (counters?.guardias_festivo_especial ?? 0) * GUARDIA_RATE.festivo_especial

  const extrasTotal = extras.reduce((s, e) => s + EXTRA_RATE[e.tipo as ExtraTipo], 0)
  const totalBrutoAnual = salarioBase * 12 + guardiaTotal + extrasTotal

  // ── Actions ─────────────────────────────────────────────────────────────────
  async function handleAddExtra() {
    setAddingExtra(true)
    const res = await addExtra({ profileId, fecha: extraFecha, tipo: extraTipo, descripcion: extraDesc, horas: extraHoras })
    if (res.error) {
      setMessage({ type: 'err', text: res.error })
    } else {
      const newEntry: Extra = {
        id: Date.now().toString(), profile_id: profileId,
        fecha: extraFecha, tipo: extraTipo,
        descripcion: extraDesc || null, horas: extraHoras,
        created_at: new Date().toISOString(),
      }
      setExtras(prev => [newEntry, ...prev])
      setExtraDesc('')
      setMessage({ type: 'ok', text: 'Registro añadido.' })
    }
    setAddingExtra(false)
  }

  async function handleDeleteExtra(id: string) {
    const res = await deleteExtra(id)
    if (!res.error) setExtras(prev => prev.filter(e => e.id !== id))
  }

  async function handleAddAbsence() {
    setAddingAbs(true)
    const res = await addAbsence({ profileId, fechaInicio: absInicio, fechaFin: absFin, tipo: absTipo, motivo: absMotivo })
    if (res.error) {
      setMessage({ type: 'err', text: res.error })
    } else {
      const newEntry: Absence = {
        id: Date.now().toString(), profile_id: profileId,
        fecha_inicio: absInicio, fecha_fin: absFin,
        tipo: absTipo, motivo: absMotivo || null,
        created_at: new Date().toISOString(),
      }
      setAbsences(prev => [newEntry, ...prev])
      setAbsMotivo('')
      setMessage({ type: 'ok', text: 'Ausencia registrada.' })
    }
    setAddingAbs(false)
  }

  async function handleDeleteAbsence(id: string) {
    const res = await deleteAbsence(id)
    if (!res.error) setAbsences(prev => prev.filter(a => a.id !== id))
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hola, {fullName.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Tu panel personal · {categoria.replace('_', ' ')} · Año {anio}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Guardias', value: totalGuardias, icon: <CalendarCheck size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Puntos',   value: totalPuntos.toFixed(1), icon: <TrendingUp size={18} className="text-purple-600" />, bg: 'bg-purple-50' },
          { label: 'Días baja', value: totalBajaDias, icon: <Activity size={18} className="text-red-500" />, bg: 'bg-red-50' },
          { label: 'Ausencias', value: totalAusencias, icon: <Umbrella size={18} className="text-amber-500" />, bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3 py-4">
            <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {[
            { id: 'resumen',     label: 'Resumen',     icon: <FileText size={15} /> },
            { id: 'extras',      label: 'Extras',      icon: <Plus size={15} /> },
            { id: 'calculadora', label: 'Calculadora', icon: <Calculator size={15} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id as any); setMessage(null) }}
              className={`flex items-center gap-1.5 pb-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Feedback */}
      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'ok'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'ok' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {message.text}
        </div>
      )}

      {/* ── TAB: RESUMEN ─────────────────────────────────────────────────────── */}
      {tab === 'resumen' && (
        <div className="space-y-6">
          {/* Guardias por tipo */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">Guardias por tipo · {anio}</h2>
            {totalGuardias === 0 ? (
              <p className="text-sm text-gray-400">Aún no tienes guardias asignadas este año.</p>
            ) : (
              <div className="space-y-2">
                {[
                  { label: 'Festivos especiales', key: 'guardias_festivo_especial', color: 'bg-red-500' },
                  { label: 'Domingos',            key: 'guardias_domingo',          color: 'bg-orange-400' },
                  { label: 'Festivos',            key: 'guardias_festivo',          color: 'bg-amber-400' },
                  { label: 'Sábados',             key: 'guardias_sabado',           color: 'bg-lime-500' },
                  { label: 'Vísperas',            key: 'guardias_vispera',          color: 'bg-emerald-400' },
                  { label: 'Laborables',          key: 'guardias_laborable',        color: 'bg-blue-400' },
                ].map(({ label, key, color }) => {
                  const val = Number((counters as any)?.[key] ?? 0)
                  const pct = totalGuardias > 0 ? Math.round((val / totalGuardias) * 100) : 0
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-36 shrink-0">{label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-2 ${color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{val}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Ausencias */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">Ausencias · {anio}</h2>
            {absences.length === 0 ? (
              <p className="text-sm text-gray-400">No hay ausencias registradas.</p>
            ) : (
              <div className="space-y-2">
                {absences.map(a => (
                  <div key={a.id} className="flex items-center gap-3 py-2 border-t border-gray-100 first:border-0">
                    <span className={`badge text-xs ${ABSENCIA_COLORS[a.tipo as AbsenciaTipo]}`}>
                      {ABSENCIA_LABELS[a.tipo as AbsenciaTipo]}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatDate(a.fecha_inicio)} → {formatDate(a.fecha_fin)}
                    </span>
                    <span className="text-xs text-gray-400">{absenceDays(a)} días</span>
                    {a.motivo && <span className="text-xs text-gray-400 truncate">· {a.motivo}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Extras resumen */}
          {extras.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-gray-800 mb-4">Extras registrados · {anio}</h2>
              <div className="space-y-2">
                {extras.slice(0, 5).map(e => (
                  <div key={e.id} className="flex items-center gap-3 py-1.5 border-t border-gray-100 first:border-0">
                    <span className={`badge text-xs ${EXTRA_COLORS[e.tipo as ExtraTipo]}`}>
                      {EXTRA_LABELS[e.tipo as ExtraTipo]}
                    </span>
                    <span className="text-sm text-gray-600">{formatDate(e.fecha)}</span>
                    {e.descripcion && <span className="text-xs text-gray-400 truncate">· {e.descripcion}</span>}
                    <span className="ml-auto text-xs text-gray-400">{EXTRA_RATE[e.tipo as ExtraTipo]}€ est.</span>
                  </div>
                ))}
                {extras.length > 5 && (
                  <button onClick={() => setTab('extras')} className="text-xs text-blue-600 hover:underline pt-1">
                    Ver todos ({extras.length})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: EXTRAS ──────────────────────────────────────────────────────── */}
      {tab === 'extras' && (
        <div className="space-y-6">
          {/* Formulario añadir extra */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-800">Registrar trabajo extraordinario</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">Fecha</label>
                <input type="date" value={extraFecha} onChange={e => setExtraFecha(e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Tipo</label>
                <select value={extraTipo} onChange={e => setExtraTipo(e.target.value as ExtraTipo)} className="input">
                  <option value="peonada">Peonada</option>
                  <option value="autoconcierto">Autoconcierto</option>
                  <option value="guardia_localizada">Guardia localizada</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="label">Horas (opcional)</label>
                <input
                  type="number" min={0} max={24} step={0.5}
                  value={extraHoras}
                  onChange={e => setExtraHoras(parseFloat(e.target.value))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Descripción (opcional)</label>
                <input
                  type="text" value={extraDesc}
                  onChange={e => setExtraDesc(e.target.value)}
                  placeholder="Ej: Cirugía urgente..."
                  className="input"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleAddExtra} disabled={addingExtra} className="btn-primary flex items-center gap-2">
                {addingExtra ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                Añadir
              </button>
            </div>
          </div>

          {/* Formulario añadir ausencia */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-800">Registrar ausencia</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">Desde</label>
                <input type="date" value={absInicio} onChange={e => setAbsInicio(e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Hasta</label>
                <input type="date" value={absFin} onChange={e => setAbsFin(e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Tipo</label>
                <select value={absTipo} onChange={e => setAbsTipo(e.target.value as AbsenciaTipo)} className="input">
                  <option value="baja">Baja médica</option>
                  <option value="vacaciones">Vacaciones</option>
                  <option value="asuntos_propios">Asuntos propios</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="label">Motivo (opcional)</label>
                <input
                  type="text" value={absMotivo}
                  onChange={e => setAbsMotivo(e.target.value)}
                  placeholder="Ej: Intervención..."
                  className="input"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleAddAbsence} disabled={addingAbs} className="btn-primary flex items-center gap-2">
                {addingAbs ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                Añadir ausencia
              </button>
            </div>
          </div>

          {/* Lista extras */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Trabajos extraordinarios · {anio}</h2>
            </div>
            {extras.length === 0 ? (
              <p className="text-sm text-gray-400 px-6 py-8 text-center">No hay registros aún.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-th">Fecha</th>
                    <th className="table-th">Tipo</th>
                    <th className="table-th">Horas</th>
                    <th className="table-th">Descripción</th>
                    <th className="table-th text-right">Est. €</th>
                    <th className="table-th"></th>
                  </tr>
                </thead>
                <tbody>
                  {extras.map(e => (
                    <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="table-td whitespace-nowrap">{formatDate(e.fecha)}</td>
                      <td className="table-td">
                        <span className={`badge text-xs ${EXTRA_COLORS[e.tipo as ExtraTipo]}`}>
                          {EXTRA_LABELS[e.tipo as ExtraTipo]}
                        </span>
                      </td>
                      <td className="table-td">{e.horas > 0 ? `${e.horas}h` : '—'}</td>
                      <td className="table-td text-gray-500">{e.descripcion ?? '—'}</td>
                      <td className="table-td text-right font-medium">{EXTRA_RATE[e.tipo as ExtraTipo]}€</td>
                      <td className="table-td">
                        <button onClick={() => handleDeleteExtra(e.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Lista ausencias */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Ausencias · {anio}</h2>
            </div>
            {absences.length === 0 ? (
              <p className="text-sm text-gray-400 px-6 py-8 text-center">No hay ausencias registradas.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-th">Desde</th>
                    <th className="table-th">Hasta</th>
                    <th className="table-th">Días</th>
                    <th className="table-th">Tipo</th>
                    <th className="table-th">Motivo</th>
                    <th className="table-th"></th>
                  </tr>
                </thead>
                <tbody>
                  {absences.map(a => (
                    <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="table-td whitespace-nowrap">{formatDate(a.fecha_inicio)}</td>
                      <td className="table-td whitespace-nowrap">{formatDate(a.fecha_fin)}</td>
                      <td className="table-td">{absenceDays(a)}</td>
                      <td className="table-td">
                        <span className={`badge text-xs ${ABSENCIA_COLORS[a.tipo as AbsenciaTipo]}`}>
                          {ABSENCIA_LABELS[a.tipo as AbsenciaTipo]}
                        </span>
                      </td>
                      <td className="table-td text-gray-500">{a.motivo ?? '—'}</td>
                      <td className="table-td">
                        <button onClick={() => handleDeleteAbsence(a.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: CALCULADORA ─────────────────────────────────────────────────── */}
      {tab === 'calculadora' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-start gap-2">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            Estimación orientativa basada en tarifas de referencia Osakidetza 2025 (bruto). No incluye trienios, complementos de destino ni IRPF.
          </div>

          {/* Desglose */}
          <div className="card space-y-0 p-0 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Desglose estimado · {anio}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Salario base */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Salario base anual</p>
                  <p className="text-xs text-gray-400">{categoria.replace('_',' ')} · 12 mensualidades</p>
                </div>
                <p className="text-base font-semibold text-gray-900">{(salarioBase * 12).toLocaleString('es-ES')} €</p>
              </div>

              {/* Guardias */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Guardias ({totalGuardias})</p>
                    <p className="text-xs text-gray-400">Complemento por tipo de día</p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{guardiaTotal.toLocaleString('es-ES')} €</p>
                </div>
                {totalGuardias > 0 && (
                  <div className="space-y-1 pl-2 border-l-2 border-gray-100">
                    {[
                      { label: 'Festivos especiales', key: 'guardias_festivo_especial', rate: GUARDIA_RATE.festivo_especial },
                      { label: 'Festivos',            key: 'guardias_festivo',          rate: GUARDIA_RATE.festivo },
                      { label: 'Domingos',            key: 'guardias_domingo',          rate: GUARDIA_RATE.domingo },
                      { label: 'Sábados',             key: 'guardias_sabado',           rate: GUARDIA_RATE.sabado },
                      { label: 'Vísperas',            key: 'guardias_vispera',          rate: GUARDIA_RATE.vispera },
                      { label: 'Puentes',             key: 'guardias_puente',           rate: GUARDIA_RATE.puente },
                      { label: 'Laborables',          key: 'guardias_laborable',        rate: GUARDIA_RATE.laborable },
                    ].map(({ label, key, rate }) => {
                      const n = Number((counters as any)?.[key] ?? 0)
                      if (!n) return null
                      return (
                        <div key={key} className="flex justify-between text-xs text-gray-500 py-0.5">
                          <span>{label}: {n} × {rate}€</span>
                          <span>{(n * rate).toLocaleString('es-ES')} €</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Extras */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Extras ({extras.length})</p>
                    <p className="text-xs text-gray-400">Peonadas, autoconciertos, etc.</p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{extrasTotal.toLocaleString('es-ES')} €</p>
                </div>
                {extras.length > 0 && (
                  <div className="space-y-1 pl-2 border-l-2 border-gray-100">
                    {(['peonada','autoconcierto','guardia_localizada','otro'] as ExtraTipo[]).map(tipo => {
                      const n = extras.filter(e => e.tipo === tipo).length
                      if (!n) return null
                      return (
                        <div key={tipo} className="flex justify-between text-xs text-gray-500 py-0.5">
                          <span>{EXTRA_LABELS[tipo]}: {n} × {EXTRA_RATE[tipo]}€</span>
                          <span>{(n * EXTRA_RATE[tipo]).toLocaleString('es-ES')} €</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="px-6 py-5 bg-blue-50 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-900">Total bruto estimado {anio}</p>
                  <p className="text-xs text-blue-600">Salario base + guardias + extras</p>
                </div>
                <p className="text-2xl font-bold text-blue-700">{totalBrutoAnual.toLocaleString('es-ES')} €</p>
              </div>
            </div>
          </div>

          {/* Referencia de tarifas */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-3 text-sm">Tarifas de referencia utilizadas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-500">
              <div>
                <p className="font-medium text-gray-700 mb-1">Guardias</p>
                {Object.entries(GUARDIA_RATE).map(([k, v]) => (
                  <p key={k}>{k.replace('_',' ')}: {v}€</p>
                ))}
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Extras</p>
                {Object.entries(EXTRA_RATE).map(([k, v]) => (
                  <p key={k}>{EXTRA_LABELS[k as ExtraTipo]}: {v}€</p>
                ))}
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Salario base mensual</p>
                {Object.entries(SALARIO_BASE).map(([k, v]) => (
                  <p key={k}>{k.replace('_',' ')}: {v}€</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
