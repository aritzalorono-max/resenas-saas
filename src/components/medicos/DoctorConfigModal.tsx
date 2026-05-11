'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { updateDoctor } from '@/lib/actions/doctors'
import { listPeriodos, createPeriodo, deletePeriodo } from '@/lib/actions/periodos'
import { listJornada, createJornada, deleteJornada } from '@/lib/actions/jornada'
import { type Doctor, type Periodo, type TipoPeriodo, type JornadaPeriodo, TIPO_PERIODO_LABEL } from '@/types'

const TIPOS_PERIODO: TipoPeriodo[] = ['NoGuardia', 'Excedencia', 'Baja']

function fmt(dateStr: string | null): string {
  if (!dateStr) return 'Vigente'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function JornadaLabel({ j }: { j: JornadaPeriodo }) {
  const tipo = j.jornada_completa
    ? 'Jornada completa'
    : `Jornada reducida ${j.reduccion_porcentaje ?? ''}%`
  return (
    <div>
      <p className="text-sm font-medium text-gray-800">{tipo}</p>
      <p className="text-xs text-gray-500 mt-0.5">{fmt(j.fecha_inicio)} → {fmt(j.fecha_fin)}</p>
    </div>
  )
}

export function DoctorConfigModal({ doctor, onClose, onSaved }: {
  doctor: Doctor
  onClose: () => void
  onSaved: () => void
}) {
  const [fechaInicio,        setFechaInicio]        = useState(doctor.fecha_inicio_contrato ?? '')
  const [fechaFin,           setFechaFin]           = useState(doctor.fecha_fin_contrato ?? '')
  const [periodos,           setPeriodos]           = useState<Periodo[]>([])
  const [jornadas,           setJornadas]           = useState<JornadaPeriodo[]>([])

  // Jornada form
  const [showJornadaForm,    setShowJornadaForm]    = useState(false)
  const [newJornadaCompleta, setNewJornadaCompleta] = useState(true)
  const [newReduccion,       setNewReduccion]       = useState('')
  const [newJornadaInicio,   setNewJornadaInicio]   = useState('')
  const [newJornadaFin,      setNewJornadaFin]      = useState('')
  const [addingJornada,      setAddingJornada]      = useState(false)

  // Periodos form
  const [showAddForm,        setShowAddForm]        = useState(false)
  const [newTipo,            setNewTipo]            = useState<TipoPeriodo>('NoGuardia')
  const [newInicio,          setNewInicio]          = useState('')
  const [newFin,             setNewFin]             = useState('')
  const [addingPeriodo,      setAddingPeriodo]      = useState(false)

  const [saving,             setSaving]             = useState(false)
  const [error,              setError]              = useState('')

  useEffect(() => {
    listPeriodos(doctor.id).then(setPeriodos)
    listJornada(doctor.id).then(setJornadas)
  }, [doctor.id])

  async function handleSave() {
    setSaving(true)
    setError('')
    const result = await updateDoctor(doctor.id, {
      fecha_inicio_contrato: fechaInicio || null,
      fecha_fin_contrato:    fechaFin || null,
    })
    setSaving(false)
    if (result.error) { setError(result.error); return }
    onSaved()
  }

  async function handleAddJornada() {
    if (!newJornadaInicio) return
    setAddingJornada(true)
    const pct = newJornadaCompleta ? null : (newReduccion ? parseInt(newReduccion) : null)
    const result = await createJornada(doctor.id, newJornadaCompleta, pct, newJornadaInicio, newJornadaFin || null)
    if (!result.error) {
      const updated = await listJornada(doctor.id)
      setJornadas(updated)
      setShowJornadaForm(false)
      setNewJornadaInicio('')
      setNewJornadaFin('')
      setNewReduccion('')
      setNewJornadaCompleta(true)
    }
    setAddingJornada(false)
  }

  async function handleDeleteJornada(id: string) {
    await deleteJornada(id)
    setJornadas(prev => prev.filter(j => j.id !== id))
  }

  async function handleAddPeriodo() {
    if (!newInicio || !newFin) return
    setAddingPeriodo(true)
    const result = await createPeriodo(doctor.id, newTipo, newInicio, newFin)
    if (!result.error) {
      const updated = await listPeriodos(doctor.id)
      setPeriodos(updated)
      setShowAddForm(false)
      setNewInicio('')
      setNewFin('')
    }
    setAddingPeriodo(false)
  }

  async function handleDeletePeriodo(id: string) {
    await deletePeriodo(id)
    setPeriodos(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{doctor.nombre}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Configuración y disponibilidad</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-6">

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          {/* Jornada como periodos */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Jornada</h3>
              <button onClick={() => { setShowJornadaForm(!showJornadaForm); setNewJornadaCompleta(true); setNewReduccion(''); setNewJornadaInicio(''); setNewJornadaFin('') }}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors">
                <Plus size={13} />
                Añadir periodo
              </button>
            </div>

            {showJornadaForm && (
              <div className="bg-gray-50 rounded-xl p-4 mb-3 space-y-3 border border-gray-200">
                <div className="flex gap-2">
                  <button onClick={() => setNewJornadaCompleta(true)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      newJornadaCompleta ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}>Completa</button>
                  <button onClick={() => setNewJornadaCompleta(false)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      !newJornadaCompleta ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}>Reducida</button>
                </div>
                {!newJornadaCompleta && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600 shrink-0">% de reducción</label>
                    <input type="number" min="1" max="99" className="input w-24 text-center"
                      value={newReduccion} onChange={e => setNewReduccion(e.target.value)} placeholder="50" />
                    <span className="text-sm text-gray-400">%</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Desde</label>
                    <input type="date" className="input" value={newJornadaInicio} onChange={e => setNewJornadaInicio(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Hasta (opcional)</label>
                    <input type="date" className="input" value={newJornadaFin} onChange={e => setNewJornadaFin(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowJornadaForm(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                  <button onClick={handleAddJornada} disabled={!newJornadaInicio || addingJornada}
                    className="btn-primary flex-1 justify-center">
                    {addingJornada ? 'Guardando…' : 'Guardar'}
                  </button>
                </div>
              </div>
            )}

            {jornadas.length === 0 && !showJornadaForm && (
              <p className="text-sm text-gray-400 text-center py-3">Sin periodos de jornada añadidos</p>
            )}

            <div className="space-y-2">
              {jornadas.map(j => (
                <div key={j.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50 border border-gray-200">
                  <JornadaLabel j={j} />
                  <button onClick={() => handleDeleteJornada(j.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Contrato */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contrato</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Inicio de contrato</label>
                <input type="date" className="input" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
              </div>
              <div>
                <label className="label">Cese de contrato</label>
                <input type="date" className="input" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">Dejar vacío si es indefinido</p>
              </div>
            </div>
          </section>

          {/* Periodos sin disponibilidad */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Periodos sin disponibilidad</h3>
              <button onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors">
                <Plus size={13} />
                Añadir
              </button>
            </div>

            {showAddForm && (
              <div className="bg-gray-50 rounded-xl p-4 mb-3 space-y-3 border border-gray-200">
                <div>
                  <label className="label">Tipo</label>
                  <select className="input" value={newTipo} onChange={e => setNewTipo(e.target.value as TipoPeriodo)}>
                    {TIPOS_PERIODO.map(t => <option key={t} value={t}>{TIPO_PERIODO_LABEL[t]}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Desde</label>
                    <input type="date" className="input" value={newInicio} onChange={e => setNewInicio(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Hasta</label>
                    <input type="date" className="input" value={newFin} onChange={e => setNewFin(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAddForm(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                  <button onClick={handleAddPeriodo} disabled={!newInicio || !newFin || addingPeriodo}
                    className="btn-primary flex-1 justify-center">
                    {addingPeriodo ? 'Guardando…' : 'Guardar periodo'}
                  </button>
                </div>
              </div>
            )}

            {periodos.length === 0 && !showAddForm && (
              <p className="text-sm text-gray-400 text-center py-4">Sin periodos añadidos</p>
            )}

            <div className="space-y-2">
              {periodos.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{TIPO_PERIODO_LABEL[p.tipo]}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{fmt(p.fecha_inicio)} → {fmt(p.fecha_fin)}</p>
                  </div>
                  <button onClick={() => handleDeletePeriodo(p.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>

        <div className="p-5 border-t border-gray-100 shrink-0 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
            {saving ? 'Guardando…' : 'Guardar contrato'}
          </button>
        </div>

      </div>
    </div>
  )
}
