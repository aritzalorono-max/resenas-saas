'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createSpecialDay, deleteSpecialDay } from '@/lib/actions/holidays'
import { type SpecialDay } from '@/types'

interface Props {
  specialDay?: SpecialDay
  defaultAnio: number
  onClose: () => void
  onSaved: () => void
}

export function SpecialDayModal({ specialDay, defaultAnio, onClose, onSaved }: Props) {
  const isEdit = !!specialDay

  const [fecha,         setFecha]         = useState(specialDay?.fecha ?? `${defaultAnio}-01-01`)
  const [tipoOverride,  setTipoOverride]  = useState<'puente' | 'vispera' | 'festivo_especial'>(
    specialDay?.tipo_override ?? 'puente'
  )
  const [motivo,  setMotivo]   = useState(specialDay?.motivo ?? '')
  const [error,   setError]    = useState('')
  const [loading, setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await createSpecialDay({ fecha, tipoOverride, motivo: motivo || undefined })
    if (result.error) { setError(result.error); setLoading(false); return }
    onSaved()
  }

  async function handleDelete() {
    if (!specialDay || !confirm('¿Eliminar este día especial?')) return
    const result = await deleteSpecialDay(specialDay.id)
    if (result.error) { setError(result.error); return }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Día especial / Puente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label className="label">Fecha *</label>
            <input type="date" required className="input" value={fecha}
              onChange={e => setFecha(e.target.value)} />
          </div>

          <div>
            <label className="label">Clasificación *</label>
            <select className="input" value={tipoOverride}
              onChange={e => setTipoOverride(e.target.value as 'puente' | 'vispera' | 'festivo_especial')}>
              <option value="puente">Puente</option>
              <option value="vispera">Víspera adicional</option>
              <option value="festivo_especial">Festivo especial</option>
            </select>
          </div>

          <div>
            <label className="label">Motivo</label>
            <input type="text" className="input" value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Ej: Puente de la Constitución" />
          </div>

          <div className="flex gap-3 pt-2">
            {isEdit && (
              <button type="button" onClick={handleDelete} className="btn-danger">Eliminar</button>
            )}
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Guardando…' : 'Añadir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
