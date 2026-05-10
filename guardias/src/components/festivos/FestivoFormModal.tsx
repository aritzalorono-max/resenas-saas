'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createHoliday, updateHoliday, deleteHoliday } from '@/lib/actions/holidays'
import { type Holiday, type HolidayTipo, TIPO_LABELS } from '@/types'

const TIPOS = Object.keys(TIPO_LABELS) as HolidayTipo[]

interface Props {
  holiday?: Holiday
  defaultAnio: number
  onClose: () => void
  onSaved: () => void
}

export function FestivoFormModal({ holiday, defaultAnio, onClose, onSaved }: Props) {
  const isEdit = !!holiday

  const [nombre,       setNombre]       = useState(holiday?.nombre ?? '')
  const [fecha,        setFecha]        = useState(holiday?.fecha ?? `${defaultAnio}-01-01`)
  const [tipo,         setTipo]         = useState<HolidayTipo>(holiday?.tipo ?? 'nacional')
  const [esRecurrente, setEsRecurrente] = useState(holiday?.es_recurrente ?? false)
  const [notas,        setNotas]        = useState(holiday?.notas ?? '')
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)
  const [deleting,     setDeleting]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = isEdit
      ? await updateHoliday(holiday.id, { nombre, fecha, tipo, esRecurrente, notas: notas || null })
      : await createHoliday({ nombre, fecha, tipo, esRecurrente, notas: notas || undefined })

    if (result.error) { setError(result.error); setLoading(false); return }
    onSaved()
  }

  async function handleDelete() {
    if (!holiday || !confirm(`¿Eliminar "${holiday.nombre}"?`)) return
    setDeleting(true)
    const result = await deleteHoliday(holiday.id)
    if (result.error) { setError(result.error); setDeleting(false); return }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Editar festivo' : 'Añadir festivo'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label className="label">Nombre *</label>
            <input type="text" required className="input" value={nombre}
              onChange={e => setNombre(e.target.value)} placeholder="Ej: Día del Trabajador" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Fecha *</label>
              <input type="date" required className="input" value={fecha}
                onChange={e => setFecha(e.target.value)} />
            </div>
            <div>
              <label className="label">Tipo *</label>
              <select className="input" value={tipo} onChange={e => setTipo(e.target.value as HolidayTipo)}>
                {TIPOS.map(t => <option key={t} value={t}>{TIPO_LABELS[t]}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Notas</label>
            <input type="text" className="input" value={notas}
              onChange={e => setNotas(e.target.value)} placeholder="Observaciones opcionales…" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={esRecurrente} onChange={e => setEsRecurrente(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-700">Festivo recurrente (misma fecha cada año)</span>
          </label>

          <div className="flex gap-3 pt-2">
            {isEdit && (
              <button type="button" onClick={handleDelete} disabled={deleting}
                className="btn-danger">
                {deleting ? '…' : 'Eliminar'}
              </button>
            )}
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Guardando…' : isEdit ? 'Guardar' : 'Añadir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
