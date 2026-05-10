'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createDoctorProfile, updateDoctorProfile } from '@/lib/actions/doctors'
import { type DoctorProfile, type GuardiasProfile, type DoctorCategoria, CATEGORIA_LABELS } from '@/types'

const CATEGORIAS = Object.keys(CATEGORIA_LABELS) as DoctorCategoria[]

interface Props {
  profile?: GuardiasProfile         // for creating a doctor profile for an existing user
  doctorProfile?: DoctorProfile     // for editing
  onClose: () => void
  onSaved: () => void
}

export function MedicoFormModal({ profile, doctorProfile, onClose, onSaved }: Props) {
  const isEdit = !!doctorProfile

  const [categoria,     setCategoria]     = useState<DoctorCategoria>(doctorProfile?.categoria ?? 'Adjunto')
  const [numColegiado,  setNumColegiado]  = useState(doctorProfile?.num_colegiado ?? '')
  const [especialidad,  setEspecialidad]  = useState(doctorProfile?.especialidad ?? 'Urología')
  const [anioInicio,    setAnioInicio]    = useState<string>(String(doctorProfile?.anio_inicio ?? ''))
  const [activo,        setActivo]        = useState(doctorProfile?.activo ?? true)
  const [notas,         setNotas]         = useState(doctorProfile?.notas ?? '')
  const [error,         setError]         = useState('')
  const [loading,       setLoading]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    let result: { error?: string; success?: boolean }

    if (isEdit) {
      result = await updateDoctorProfile(doctorProfile.id, {
        categoria,
        numColegiado:  numColegiado || null,
        especialidad,
        anioInicio:    anioInicio ? Number(anioInicio) : null,
        activo,
        notas:         notas || null,
      })
    } else {
      if (!profile) { setError('Perfil de usuario no especificado.'); setLoading(false); return }
      result = await createDoctorProfile({
        profileId:     profile.id,
        categoria,
        numColegiado:  numColegiado || undefined,
        especialidad,
        anioInicio:    anioInicio ? Number(anioInicio) : undefined,
        notas:         notas || undefined,
      })
    }

    if (result.error) { setError(result.error); setLoading(false); return }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Editar perfil médico' : `Configurar perfil de ${profile?.full_name}`}
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
            <label className="label">Categoría profesional *</label>
            <select className="input" value={categoria} onChange={e => setCategoria(e.target.value as DoctorCategoria)}>
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{CATEGORIA_LABELS[cat]}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nº Colegiado</label>
              <input type="text" className="input" value={numColegiado}
                onChange={e => setNumColegiado(e.target.value)} placeholder="28/12345" />
            </div>
            <div>
              <label className="label">Año de inicio</label>
              <input type="number" className="input" value={anioInicio}
                onChange={e => setAnioInicio(e.target.value)}
                placeholder={String(new Date().getFullYear())} min={1970} max={2100} />
            </div>
          </div>

          <div>
            <label className="label">Especialidad</label>
            <input type="text" className="input" value={especialidad}
              onChange={e => setEspecialidad(e.target.value)} />
          </div>

          <div>
            <label className="label">Notas</label>
            <textarea rows={2} className="input resize-none" value={notas}
              onChange={e => setNotas(e.target.value)} placeholder="Observaciones opcionales…" />
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-700">Médico activo</span>
            </label>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
