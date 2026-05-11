'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MedicoFormModal } from './MedicoFormModal'
import { type DoctorProfile, type TeamMember, type TeamInvitation, type ShiftCounters, CATEGORIA_LABELS } from '@/types'
import { UserPlus, Pencil, Clock } from 'lucide-react'

interface Props {
  doctors: DoctorProfile[]
  members: TeamMember[]
  invitations: TeamInvitation[]
  counters: ShiftCounters[]
  canEdit: boolean
  anio: number
}

type ModalState =
  | { type: 'create'; prefillNombre?: string; prefillProfileId?: string }
  | { type: 'edit'; doctor: DoctorProfile }
  | null

export function MedicosClient({ doctors, members, invitations, counters, canEdit, anio }: Props) {
  const router = useRouter()
  const [modal, setModal] = useState<ModalState>(null)
  const [localDoctors, setLocalDoctors] = useState(doctors)

  const activeMembers = members.filter(m => m.status === 'active')

  function getCounters(profileId: string | null) {
    if (!profileId) return undefined
    return counters.find(c => c.profile_id === profileId)
  }

  function getDoctorForMember(profileId: string) {
    return localDoctors.find(d => d.profile_id === profileId)
  }

  function getDoctorName(doc: DoctorProfile) {
    return doc.nombre ?? doc.profile?.full_name ?? '—'
  }

  function handleSaved() {
    setModal(null)
    router.refresh()
  }

  // Rows: active members first, then unlinked doctors, then pending invitations
  const linkedProfileIds = new Set(activeMembers.map(m => m.profile_id))
  const unlinkedDoctors = localDoctors.filter(d => !d.profile_id || !linkedProfileIds.has(d.profile_id))

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {activeMembers.length} miembros activos · {anio}
          </p>
        </div>
        {canEdit && (
          <button onClick={() => setModal({ type: 'create' })} className="btn-primary gap-2">
            <UserPlus size={16} />
            Añadir médico
          </button>
        )}
      </div>

      <div className="card overflow-hidden p-0">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-th">Nombre</th>
              <th className="table-th">Categoría</th>
              <th className="table-th">Jornada</th>
              <th className="table-th">Inicio</th>
              <th className="table-th">Guardias {anio}</th>
              <th className="table-th">Puntos {anio}</th>
              <th className="table-th">Estado</th>
              {canEdit && <th className="table-th w-10"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">

            {/* Active team members */}
            {activeMembers.map(m => {
              const doc = getDoctorForMember(m.profile_id)
              const c = doc ? getCounters(m.profile_id) : undefined
              return (
                <tr key={m.profile_id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-td font-medium text-gray-900">
                    {doc ? getDoctorName(doc) : (m.profile?.full_name ?? '—')}
                  </td>
                  <td className="table-td">
                    {doc ? (
                      <span className="badge bg-blue-100 text-blue-800">{CATEGORIA_LABELS[doc.categoria]}</span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Sin configurar</span>
                    )}
                  </td>
                  <td className="table-td text-xs text-gray-500">
                    {doc ? (
                      doc.jornada_completa ? 'Completa' : `${doc.reduccion_porcentaje ?? '?'}% red.`
                    ) : '—'}
                  </td>
                  <td className="table-td text-gray-500">{doc?.anio_inicio ?? '—'}</td>
                  <td className="table-td">
                    {doc ? (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{c?.total_guardias ?? 0}</span>
                        <span className="text-xs text-gray-400 hidden sm:block">
                          ({c?.guardias_festivo_especial ?? 0}fe / {c?.guardias_domingo ?? 0}do / {c?.guardias_festivo ?? 0}f)
                        </span>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="table-td font-medium">
                    {doc ? Number(c?.puntos_acumulados ?? 0).toFixed(1) : '—'}
                  </td>
                  <td className="table-td">
                    {doc ? (
                      <span className={`badge ${doc.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {doc.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    ) : canEdit ? (
                      <button
                        onClick={() => setModal({ type: 'create', prefillNombre: m.profile?.full_name, prefillProfileId: m.profile_id })}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Configurar
                      </button>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  {canEdit && (
                    <td className="table-td">
                      {doc && (
                        <button onClick={() => setModal({ type: 'edit', doctor: doc })}
                          className="text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                          <Pencil size={15} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}

            {/* Unlinked doctors (added manually, not team members) */}
            {unlinkedDoctors.map(doc => {
              const c = getCounters(doc.profile_id)
              return (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-td font-medium text-gray-900">{getDoctorName(doc)}</td>
                  <td className="table-td">
                    <span className="badge bg-blue-100 text-blue-800">{CATEGORIA_LABELS[doc.categoria]}</span>
                  </td>
                  <td className="table-td text-xs text-gray-500">
                    {doc.jornada_completa ? 'Completa' : `${doc.reduccion_porcentaje ?? '?'}% red.`}
                  </td>
                  <td className="table-td text-gray-500">{doc.anio_inicio ?? '—'}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{c?.total_guardias ?? 0}</span>
                    </div>
                  </td>
                  <td className="table-td font-medium">{Number(c?.puntos_acumulados ?? 0).toFixed(1)}</td>
                  <td className="table-td">
                    <span className={`badge ${doc.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {doc.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="table-td">
                      <button onClick={() => setModal({ type: 'edit', doctor: doc })}
                        className="text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                        <Pencil size={15} />
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}

            {/* Pending invitations */}
            {invitations.map(inv => (
              <tr key={inv.id} className="bg-gray-50/50 opacity-60">
                <td className="table-td">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-gray-500">{inv.email}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                      <Clock size={10} />
                      Pendiente
                    </span>
                  </div>
                </td>
                <td className="table-td text-gray-400">—</td>
                <td className="table-td text-gray-400">—</td>
                <td className="table-td text-gray-400">—</td>
                <td className="table-td text-gray-400">—</td>
                <td className="table-td text-gray-400">—</td>
                <td className="table-td text-gray-400 text-xs italic">Sin cuenta</td>
                {canEdit && <td className="table-td" />}
              </tr>
            ))}

            {activeMembers.length === 0 && unlinkedDoctors.length === 0 && invitations.length === 0 && (
              <tr>
                <td colSpan={canEdit ? 8 : 7} className="table-td text-center text-gray-400 py-10">
                  No hay médicos en el equipo todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal?.type === 'create' && (
        <MedicoFormModal
          prefillNombre={modal.prefillNombre}
          prefillProfileId={modal.prefillProfileId}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {modal?.type === 'edit' && (
        <MedicoFormModal
          doctorProfile={modal.doctor}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
