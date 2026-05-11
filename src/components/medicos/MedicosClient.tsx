'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createDoctor, updateDoctor, deleteDoctor } from '@/lib/actions/doctors'
import { type Doctor, type DoctorCategoria, CATEGORIA_LABELS, CATEGORIA_COLORS } from '@/types'
import { Plus, X, Pencil, Trash2, UserCheck, UserX, AlertTriangle } from 'lucide-react'

const CATEGORIAS: DoctorCategoria[] = ['Adjunto', 'R1', 'R2', 'R3', 'R4', 'R5']

// ── Modal añadir / editar ─────────────────────────────────────────────────────

function DoctorModal({
  doctor,
  onClose,
  onSaved,
}: {
  doctor?: Doctor
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!doctor
  const [nombre,    setNombre]    = useState(doctor?.nombre ?? '')
  const [categoria, setCategoria] = useState<DoctorCategoria>(doctor?.categoria ?? 'Adjunto')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) { setError('El nombre es obligatorio.'); return }
    setError('')
    setLoading(true)
    const result = isEdit
      ? await updateDoctor(doctor.id, { nombre, categoria })
      : await createDoctor(nombre, categoria)
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
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
              type="text" required autoFocus className="input"
              value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Dr. García López"
            />
          </div>

          <div>
            <label className="label">Categoría *</label>
            <select className="input" value={categoria} onChange={e => setCategoria(e.target.value as DoctorCategoria)}>
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat === 'Adjunto' ? 'Médico Adjunto' : `Residente ${cat}`}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Añadir médico'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Fila de médico ────────────────────────────────────────────────────────────

function DoctorRow({ doctor, onEdit, onRefresh }: { doctor: Doctor; onEdit: () => void; onRefresh: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loading,       setLoading]       = useState(false)

  async function handleToggleActivo() {
    setLoading(true)
    await updateDoctor(doctor.id, { activo: !doctor.activo })
    onRefresh()
  }

  async function handleDelete() {
    setLoading(true)
    await deleteDoctor(doctor.id)
    onRefresh()
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
      doctor.activo ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${doctor.activo ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
          {doctor.nombre}
        </p>
        <span className={`inline-flex mt-0.5 items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORIA_COLORS[doctor.categoria]}`}>
          {doctor.categoria === 'Adjunto' ? 'Adjunto' : `Residente ${doctor.categoria}`}
        </span>
      </div>

      {/* Acciones */}
      {!confirmDelete ? (
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onEdit} title="Editar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={handleToggleActivo} disabled={loading}
            title={doctor.activo ? 'Marcar como inactivo' : 'Marcar como activo'}
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
            {doctor.activo ? <UserX size={15} /> : <UserCheck size={15} />}
          </button>
          <button onClick={() => setConfirmDelete(true)} title="Eliminar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          <AlertTriangle size={14} className="text-red-500" />
          <span className="text-xs text-red-600">¿Eliminar?</span>
          <button onClick={handleDelete} disabled={loading}
            className="text-xs font-medium text-red-600 hover:text-red-800">
            Sí
          </button>
          <button onClick={() => setConfirmDelete(false)}
            className="text-xs text-gray-500 hover:text-gray-700">
            No
          </button>
        </div>
      )}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

export function MedicosClient({ doctors: initial }: { doctors: Doctor[] }) {
  const router  = useRouter()
  const [doctors,     setDoctors]     = useState<Doctor[]>(initial)
  const [showModal,   setShowModal]   = useState(false)
  const [editDoctor,  setEditDoctor]  = useState<Doctor | undefined>()

  useEffect(() => { setDoctors(initial) }, [initial])

  function refresh() {
    router.refresh()
    setDoctors(doctors) // UI optimista; router.refresh() actualizará desde el servidor
  }

  function openAdd()          { setEditDoctor(undefined); setShowModal(true) }
  function openEdit(d: Doctor){ setEditDoctor(d);          setShowModal(true) }
  function closeModal()       { setShowModal(false); setEditDoctor(undefined) }
  function onSaved()          { closeModal(); router.refresh() }

  const activos   = doctors.filter(d => d.activo)
  const inactivos = doctors.filter(d => !d.activo)

  return (
    <>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activos.length} activo{activos.length !== 1 ? 's' : ''}
            {inactivos.length > 0 && ` · ${inactivos.length} inactivo${inactivos.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} />
          Añadir médico
        </button>
      </div>

      {/* Lista vacía */}
      {doctors.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm mb-4">Aún no hay médicos. Añade el primero.</p>
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} />
            Añadir médico
          </button>
        </div>
      )}

      {/* Médicos activos */}
      {activos.length > 0 && (
        <div className="space-y-2 mb-6">
          {activos.map(d => (
            <DoctorRow key={d.id} doctor={d} onEdit={() => openEdit(d)} onRefresh={() => router.refresh()} />
          ))}
        </div>
      )}

      {/* Médicos inactivos */}
      {inactivos.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Inactivos</p>
          <div className="space-y-2">
            {inactivos.map(d => (
              <DoctorRow key={d.id} doctor={d} onEdit={() => openEdit(d)} onRefresh={() => router.refresh()} />
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <DoctorModal doctor={editDoctor} onClose={closeModal} onSaved={onSaved} />
      )}
    </>
  )
}
