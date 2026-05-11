'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createDoctorProfile, updateDoctorProfile } from '@/lib/actions/doctors'
import { type DoctorProfile, type DoctorCategoria, CATEGORIA_LABELS } from '@/types'

const CATEGORIAS: DoctorCategoria[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'Adjunto', 'Jefe_Seccion', 'Jefe_Servicio']

interface Props {
  doctorProfile?: DoctorProfile
  prefillNombre?: string
  prefillProfileId?: string
  onClose: () => void
  onSaved: () => void
}

export function MedicoFormModal({ doctorProfile, prefillNombre, prefillProfileId, onClose, onSaved }: Props) {
  const isEdit = !!doctorProfile

  const [nombre,    setNombre]    = useState(doctorProfile?.nombre ?? prefillNombre ?? '')
  const [categoria, setCategoria] = useState<DoctorCategoria>(doctorProfile?.categoria ?? 'Adjunto')
  const [activo,    setActivo]    = useState(doctorProfile?.activo ?? true)
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!nombre.trim()) { setError('El nombre es obligatorio.'); return }
    setLoading(true)

    let result: { error?: string; success?: boolean }

    if (isEdit) {
      result = await updateDoctorProfile(doctorProfile.id, {
        nombre: nombre.trim(),
        categoria,
        activo,
      })
    } else {
      result = await createDoctorProfile({
        profileId: prefillProfileId ?? null,
        nombre:    nombre.trim(),
        categoria,
      })
    }

    if (result.error) { setError(result.error); setLoading(false); return }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Editar médico' : 'Añadir médico'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label className="label">Nombre completo *</label>
            <input
              type="text" required autoFocus={!prefillNombre} className="input"
              value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Dr. García López"
            />
          </div>

          <div>
            <label className="label">Categoría *</label>
            <select className="input" value={categoria} onChange={e => setCategoria(e.target.value as DoctorCategoria)}>
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{CATEGORIA_LABELS[cat]}</option>
              ))}
            </select>
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-700">Médico activo</span>
            </label>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Añadir médico'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
