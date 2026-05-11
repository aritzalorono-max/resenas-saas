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

export function MedicosClient({ doctors, members, invitations, counters, canEdit, anio }: Props) {
  const router = useRouter()
  const [modal, setModal] = useState<
    | { type: 'create'; member: TeamMember }
    | { type: 'edit'; doctor: DoctorProfile }
    | null
  >(null)

  const activeMembers = members.filter(m => m.status === 'active')
  const membersWithoutDoctor = activeMembers.filter(
    m => !doctors.some(d => d.profile_id === m.profile_id)
  )

  function getCounters(profileId: string) {
    return counters.find(c => c.profile_id === profileId)
  }

  function getDoctorForMember(profileId: string) {
    return doctors.find(d => d.profile_id === profileId)
  }

  function handleSaved() {
    setModal(null)
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {activeMembers.length} miembros activos · {anio}
          </p>
        </div>

        {canEdit && membersWithoutDoctor.length > 0 && (
          <div className="relative group">
            <button className="btn-primary">
              <UserPlus size={16} />
              Añadir perfil
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
              {membersWithoutDoctor.map(m => (
                <button
                  key={m.profile_id}
                  onClick={() => setModal({ type: 'create', member: m })}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b last:border-0 border-gray-100"
                >
                  <span className="font-medium text-gray-900">{m.profile?.full_name ?? m.profile_id}</span>
                  <span className="block text-xs text-gray-400">Sin perfil médico</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card overflow-hidden p-0">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-th">Nombre</th>
              <th className="table-th">Categoría</th>
              <th className="table-th">Nº Colegiado</th>
              <th className="table-th">Inicio</th>
              <th className="table-th">Guardias {anio}</th>
              <th className="table-th">Puntos {anio}</th>
              <th className="table-th">Estado</th>
              {canEdit && <th className="table-th w-10"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">

            {/* Active members */}
            {activeMembers.map(m => {
              const doc = getDoctorForMember(m.profile_id)
              const c = doc ? getCounters(m.profile_id) : undefined
              const name = m.profile?.full_name ?? '—'
              return (
                <tr key={m.profile_id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-td font-medium text-gray-900">{name}</td>
                  <td className="table-td">
                    {doc ? (
                      <span className="badge bg-blue-100 text-blue-800">
                        {CATEGORIA_LABELS[doc.categoria]}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Sin configurar</span>
                    )}
                  </td>
                  <td className="table-td text-gray-500">{doc?.num_colegiado ?? '—'}</td>
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
                    ) : (
                      canEdit ? (
                        <button
                          onClick={() => setModal({ type: 'create', member: m })}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Configurar
                        </button>
                      ) : <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  {canEdit && (
                    <td className="table-td">
                      {doc && (
                        <button
                          onClick={() => setModal({ type: 'edit', doctor: doc })}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                      )}
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

            {activeMembers.length === 0 && invitations.length === 0 && (
              <tr>
                <td colSpan={canEdit ? 8 : 7} className="table-td text-center text-gray-400 py-10">
                  No hay médicos en el equipo todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal?.type === 'create' && (
        <MedicoFormModal
          profile={{ id: modal.member.profile_id, full_name: modal.member.profile?.full_name ?? '' } as any}
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
