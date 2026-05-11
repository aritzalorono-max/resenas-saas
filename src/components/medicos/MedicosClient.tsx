'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MedicoFormModal } from './MedicoFormModal'
import { type DoctorProfile, type GuardiasProfile, type ShiftCounters, CATEGORIA_LABELS } from '@/types'
import { UserPlus, Pencil, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  doctors: DoctorProfile[]
  profiles: GuardiasProfile[]
  counters: ShiftCounters[]
  canEdit: boolean
  anio: number
}

export function MedicosClient({ doctors, profiles, counters, canEdit, anio }: Props) {
  const router = useRouter()
  const [modal, setModal] = useState<
    | { type: 'create'; profile: GuardiasProfile }
    | { type: 'edit'; doctor: DoctorProfile }
    | null
  >(null)

  // Profiles without a doctor profile yet
  const profilesWithoutDoctor = profiles.filter(
    p => (p.role === 'medico' || p.role === 'gestor') && !doctors.some(d => d.profile_id === p.id)
  )

  function getCounters(profileId: string) {
    return counters.find(c => c.profile_id === profileId)
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
          <p className="text-gray-500 mt-1">Perfiles del Servicio de Urología · {anio}</p>
        </div>

        {canEdit && profilesWithoutDoctor.length > 0 && (
          <div className="relative group">
            <button className="btn-primary">
              <UserPlus size={16} />
              Añadir perfil
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-60 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
              {profilesWithoutDoctor.map(p => (
                <button
                  key={p.id}
                  onClick={() => setModal({ type: 'create', profile: p })}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b last:border-0 border-gray-100"
                >
                  <span className="font-medium text-gray-900">{p.full_name}</span>
                  <span className="block text-xs text-gray-400">Sin perfil médico</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {doctors.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No hay médicos configurados todavía.</p>
          {canEdit && profilesWithoutDoctor.length > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Hay {profilesWithoutDoctor.length} usuario(s) sin perfil médico.
            </p>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-th">Nombre</th>
                  <th className="table-th">Categoría</th>
                  <th className="table-th">Nº Colegiado</th>
                  <th className="table-th">Inicio</th>
                  <th className="table-th">Guardias {anio}</th>
                  <th className="table-th">Puntos {anio}</th>
                  <th className="table-th">Estado</th>
                  {canEdit && <th className="table-th">Acc.</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {doctors.map(doc => {
                  const c = getCounters(doc.profile_id)
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="table-td font-medium text-gray-900">
                        {doc.profile?.full_name ?? '—'}
                      </td>
                      <td className="table-td">
                        <span className="badge bg-blue-100 text-blue-800">
                          {CATEGORIA_LABELS[doc.categoria]}
                        </span>
                      </td>
                      <td className="table-td text-gray-500">{doc.num_colegiado ?? '—'}</td>
                      <td className="table-td text-gray-500">{doc.anio_inicio ?? '—'}</td>
                      <td className="table-td">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{c?.total_guardias ?? 0}</span>
                          <span className="text-xs text-gray-400 hidden sm:block">
                            ({c?.guardias_festivo_especial ?? 0}fe / {c?.guardias_domingo ?? 0}do / {c?.guardias_festivo ?? 0}f)
                          </span>
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
                          <button
                            onClick={() => setModal({ type: 'edit', doctor: doc })}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal?.type === 'create' && (
        <MedicoFormModal
          profile={modal.profile}
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
