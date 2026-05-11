'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createDoctorProfile, updateDoctorProfile } from '@/lib/actions/doctors'
import { type DoctorProfile, type DoctorCategoria, CATEGORIA_LABELS } from '@/types'

const CATEGORIAS: DoctorCategoria[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'Adjunto']

interface Props {
  doctorProfile?: DoctorProfile   // editing existing
  prefillNombre?: string          // creating for a known team member
  prefillProfileId?: string
  onClose: () => void
  onSaved: () => void
}

export function MedicoFormModal({ doctorProfile, prefillNombre, prefillProfileId, onClose, onSaved }: Props) {
  const isEdit = !!doctorProfile

  const [nombre,        setNombre]        = useState(doctorProfile?.nombre ?? prefillNombre ?? '')
  const [categoria,     setCategoria]     = useState<DoctorCategoria>(doctorProfile?.categoria ?? 'Adjunto')
  const [anioInicio,    setAnioInicio]    = useState(String(doctorProfile?.anio_inicio ?? ''))
  const [activo,        setActivo]        = useState(doctorProfile?.activo ?? true)

  const [jornadaCompleta, setJornadaCompleta] = useState(doctorProfile?.jornada_completa ?? true)
  const [reduccionPct,  setReduccionPct]  = useState(String(doctorProfile?.reduccion_porcentaje ?? ''))
  const [fechaInicio,   setFechaInicio]   = useState(doctorProfile?.reduccion_fecha_inicio ?? '')
  const [fechaFin,      setFechaFin]      = useState(doctorProfile?.reduccion_fecha_fin ?? '')

  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!nombre.trim()) { setError('El nombre es obligatorio.'); return }
    if (!jornadaCompleta && !reduccionPct) { setError('Indica el porcentaje de reducción.'); return }

    setLoading(true)

    const jornadaData = {
      jornadaCompleta,
      reduccionPorcentaje: !jornadaCompleta && reduccionPct ? parseFloat(reduccionPct) : null,
      reduccionFechaInicio: !jornadaCompleta && fechaInicio ? fechaInicio : null,
      reduccionFechaFin:    !jornadaCompleta && fechaFin    ? fechaFin    : null,
    }

    let result: { error?: string; success?: boolean }

    if (isEdit) {
      result = await updateDoctorProfile(doctorProfile.id, {
        nombre:    nombre.trim(),
        categoria,
        anioInicio: anioInicio ? Number(anioInicio) : null,
        activo,
        ...jornadaData,
      })
    } else {
      result = await createDoctorProfile({
        profileId:  prefillProfileId ?? null,
        nombre:     nombre.trim(),
        categoria,
        anioInicio: anioInicio ? Number(anioInicio) : undefined,
        ...jornadaData,
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
              type="text" required className="input" value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Dr. García López"
              autoFocus={!prefillNombre}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Categoría *</label>
              <select className="input" value={categoria} onChange={e => setCategoria(e.target.value as DoctorCategoria)}>
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{CATEGORIA_LABELS[cat]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Año de inicio</label>
              <input
                type="number" className="input" value={anioInicio}
                onChange={e => setAnioInicio(e.target.value)}
                placeholder={String(new Date().getFullYear())} min={1970} max={2100}
              />
            </div>
          </div>

          {/* Jornada */}
          <div>
            <label className="label">Jornada</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="jornada" checked={jornadaCompleta}
                  onChange={() => { setJornadaCompleta(true); setReduccionPct(''); setFechaInicio(''); setFechaFin('') }}
                  className="text-blue-600" />
                <span className="text-sm text-gray-700">Jornada completa</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="jornada" checked={!jornadaCompleta}
                  onChange={() => setJornadaCompleta(false)}
                  className="text-blue-600" />
                <span className="text-sm text-gray-700">Reducción de jornada</span>
              </label>
            </div>

            {!jornadaCompleta && (
              <div className="mt-3 space-y-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="number" min="1" max="99" step="1" required
                    className="input w-24" value={reduccionPct}
                    onChange={e => setReduccionPct(e.target.value)}
                    placeholder="50"
                  />
                  <span className="text-sm text-gray-600">% de reducción</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Fecha inicio</label>
                    <input type="date" className="input" value={fechaInicio}
                      onChange={e => setFechaInicio(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Fecha fin</label>
                    <input type="date" className="input" value={fechaFin}
                      onChange={e => setFechaFin(e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 cursor-pointer">
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
