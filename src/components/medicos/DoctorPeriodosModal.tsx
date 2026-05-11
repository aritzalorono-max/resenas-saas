'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Pencil, Check, AlertCircle } from 'lucide-react'
import {
  listDoctorPeriodos, createDoctorPeriodo, updateDoctorPeriodo, deleteDoctorPeriodo,
} from '@/lib/actions/doctors'
import { type DoctorProfile, type DoctorPeriodo, type PeriodoTipo } from '@/types'

const TIPO_LABELS: Record<PeriodoTipo, string> = {
  reduccion:  'Reducción de jornada',
  excedencia: 'Excedencia',
  baja:       'Baja / IT',
}
const TIPO_COLORS: Record<PeriodoTipo, string> = {
  reduccion:  'bg-amber-100 text-amber-800',
  excedencia: 'bg-purple-100 text-purple-800',
  baja:       'bg-red-100 text-red-800',
}

function countWeekdays(start: Date, end: Date): number {
  let count = 0
  const d = new Date(start)
  d.setHours(0, 0, 0, 0)
  const e = new Date(end)
  e.setHours(0, 0, 0, 0)
  while (d <= e) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) count++
    d.setDate(d.getDate() + 1)
  }
  return count
}

function calcularDiasEfectivos(anio: number, jornadaCompleta: boolean, periodos: DoctorPeriodo[]) {
  const yearStart = new Date(anio, 0, 1)
  const yearEnd   = new Date(anio, 11, 31)
  const totalDias = countWeekdays(yearStart, yearEnd)

  // Base fraction from doctor's default jornada
  const baseFraction = jornadaCompleta ? 1.0 : 0.5 // fallback if no base reduction %

  let efectivos = 0
  const d = new Date(yearStart)
  while (d <= yearEnd) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) {
      // Find active period for this day (last one wins if overlap)
      const active = periodos.filter(p => {
        const s = new Date(p.fecha_inicio)
        const f = p.fecha_fin ? new Date(p.fecha_fin) : yearEnd
        return d >= s && d <= f
      })

      let fraction: number
      if (active.length === 0) {
        fraction = baseFraction
      } else {
        // Take the most restrictive
        const types = active.map(p => p.tipo)
        if (types.includes('excedencia') || types.includes('baja')) {
          fraction = 0
        } else {
          // reduccion: take max reduction %
          const maxRed = Math.max(...active.map(p => p.reduccion_porcentaje ?? 0))
          fraction = Math.max(0, baseFraction * (1 - maxRed / 100))
        }
      }
      efectivos += fraction
    }
    d.setDate(d.getDate() + 1)
  }
  return { efectivos: Math.round(efectivos), total: totalDias }
}

function fmt(date: string | null) {
  if (!date) return 'Indefinido'
  return new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const EMPTY_FORM = { tipo: 'baja' as PeriodoTipo, fechaInicio: '', fechaFin: '', reduccionPct: '', notas: '' }

interface Props {
  doctor: DoctorProfile
  anio: number
  initialPeriodos: DoctorPeriodo[]
  onClose: () => void
}

export function DoctorPeriodosModal({ doctor, anio, initialPeriodos, onClose }: Props) {
  const [periodos, setPeriodos] = useState<DoctorPeriodo[]>(initialPeriodos)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const doctorName = doctor.nombre ?? doctor.profile?.full_name ?? '—'
  const { efectivos, total } = calcularDiasEfectivos(anio, doctor.jornada_completa, periodos)
  const pct = total > 0 ? Math.round((efectivos / total) * 100) : 0

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowForm(true)
  }

  function openEdit(p: DoctorPeriodo) {
    setEditingId(p.id)
    setForm({
      tipo:          p.tipo,
      fechaInicio:   p.fecha_inicio,
      fechaFin:      p.fecha_fin ?? '',
      reduccionPct:  p.reduccion_porcentaje != null ? String(p.reduccion_porcentaje) : '',
      notas:         p.notas ?? '',
    })
    setError('')
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setError('')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.fechaInicio) { setError('La fecha de inicio es obligatoria.'); return }
    if (form.tipo === 'reduccion' && !form.reduccionPct) { setError('Indica el % de reducción.'); return }

    setLoading(true)
    const payload = {
      tipo:                form.tipo,
      fechaInicio:         form.fechaInicio,
      fechaFin:            form.fechaFin || null,
      reduccionPorcentaje: form.tipo === 'reduccion' && form.reduccionPct ? parseFloat(form.reduccionPct) : null,
      notas:               form.notas || null,
    }

    let result: { error?: string }
    if (editingId) {
      result = await updateDoctorPeriodo(editingId, payload)
    } else {
      result = await createDoctorPeriodo({ doctorProfileId: doctor.id, ...payload })
    }

    if (result.error) { setError(result.error); setLoading(false); return }

    // Refresh list
    const updated = await listDoctorPeriodos(doctor.id)
    setPeriodos(updated)
    setShowForm(false)
    setEditingId(null)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este periodo?')) return
    await deleteDoctorPeriodo(id)
    setPeriodos(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{doctorName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Disponibilidad y periodos especiales</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5"><X size={20} /></button>
        </div>

        {/* Days summary */}
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-0.5">Días laborables efectivos {anio}</p>
              <p className="text-2xl font-bold text-blue-900">
                {efectivos} <span className="text-base font-normal text-blue-600">/ {total} días ({pct}%)</span>
              </p>
            </div>
            {efectivos < total && (
              <div className="text-right text-sm text-blue-700">
                <p>{total - efectivos} días no trabajados</p>
              </div>
            )}
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {/* Periodos list */}
          {periodos.length === 0 && !showForm && (
            <p className="text-gray-400 text-sm text-center py-6">
              Sin periodos especiales. El médico trabaja {doctor.jornada_completa ? 'a jornada completa' : 'con reducción de jornada'} todo el año.
            </p>
          )}

          {periodos.length > 0 && (
            <div className="space-y-2">
              {periodos.map(p => (
                <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge text-xs ${TIPO_COLORS[p.tipo]}`}>{TIPO_LABELS[p.tipo]}</span>
                      {p.tipo === 'reduccion' && p.reduccion_porcentaje != null && (
                        <span className="text-xs font-semibold text-amber-700">{p.reduccion_porcentaje}% reducción</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {fmt(p.fecha_inicio)} → {fmt(p.fecha_fin)}
                    </p>
                    {p.notas && <p className="text-xs text-gray-400 mt-0.5">{p.notas}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-blue-600 p-1"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit form */}
          {showForm ? (
            <form onSubmit={handleSave} className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50/40 space-y-3">
              <p className="text-sm font-medium text-gray-800">{editingId ? 'Editar periodo' : 'Nuevo periodo'}</p>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <AlertCircle size={14} className="shrink-0" />{error}
                </div>
              )}

              <div>
                <label className="label">Tipo *</label>
                <select className="input" value={form.tipo}
                  onChange={e => setForm(f => ({ ...f, tipo: e.target.value as PeriodoTipo, reduccionPct: '' }))}>
                  <option value="baja">Baja / IT</option>
                  <option value="excedencia">Excedencia</option>
                  <option value="reduccion">Reducción de jornada</option>
                </select>
              </div>

              {form.tipo === 'reduccion' && (
                <div>
                  <label className="label">% de reducción *</label>
                  <div className="flex items-center gap-2">
                    <input type="number" required min="1" max="99" step="1"
                      className="input w-24" value={form.reduccionPct}
                      onChange={e => setForm(f => ({ ...f, reduccionPct: e.target.value }))}
                      placeholder="50" />
                    <span className="text-sm text-gray-500">% sobre jornada base</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Fecha inicio *</label>
                  <input type="date" required className="input" value={form.fechaInicio}
                    onChange={e => setForm(f => ({ ...f, fechaInicio: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Fecha fin <span className="text-gray-400 font-normal">(vacío = indefinido)</span></label>
                  <input type="date" className="input" value={form.fechaFin}
                    onChange={e => setForm(f => ({ ...f, fechaFin: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="label">Notas</label>
                <input type="text" className="input" value={form.notas}
                  onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                  placeholder="Opcional" />
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={cancelForm} className="btn-secondary text-sm py-1.5">Cancelar</button>
                <button type="submit" disabled={loading} className="btn-primary text-sm py-1.5 gap-1.5">
                  <Check size={14} />
                  {loading ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </form>
          ) : (
            <button onClick={openCreate} className="btn-secondary w-full justify-center gap-2 text-sm">
              <Plus size={15} />
              Añadir periodo
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
