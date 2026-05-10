'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FestivoFormModal } from './FestivoFormModal'
import { SpecialDayModal } from './SpecialDayModal'
import { type Holiday, type SpecialDay, TIPO_LABELS, TIPO_COLORS } from '@/types'
import { Plus, PlusCircle, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  holidays: Holiday[]
  specialDays: SpecialDay[]
  canEdit: boolean
  anio: number
}

const TIPO_ORDER = ['nacional', 'euskadi', 'bizkaia', 'galdakao', 'especial'] as const

export function FestivosClient({ holidays, specialDays, canEdit, anio }: Props) {
  const router = useRouter()
  const [modal, setModal] = useState<
    | { type: 'festivo'; holiday?: Holiday }
    | { type: 'special'; day?: SpecialDay }
    | null
  >(null)
  const [filterTipo, setFilterTipo] = useState<string>('all')

  function handleSaved() { setModal(null); router.refresh() }
  function changeAnio(delta: number) {
    router.push(`/festivos?anio=${anio + delta}`)
  }

  const filtered = filterTipo === 'all'
    ? holidays
    : holidays.filter(h => h.tipo === filterTipo)

  // Group by month
  const byMonth: Record<number, Holiday[]> = {}
  filtered.forEach(h => {
    const m = new Date(h.fecha + 'T00:00:00').getMonth() + 1
    ;(byMonth[m] ??= []).push(h)
  })

  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  return (
    <>
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Festivos</h1>
          <p className="text-gray-500 mt-1">Calendario de festivos de Osakidetza · Galdakao</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de año */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1.5">
            <button onClick={() => changeAnio(-1)} className="p-1 hover:text-blue-600"><ChevronLeft size={16} /></button>
            <span className="text-sm font-semibold text-gray-900 px-2">{anio}</span>
            <button onClick={() => changeAnio(1)} className="p-1 hover:text-blue-600"><ChevronRight size={16} /></button>
          </div>

          {canEdit && (
            <>
              <button onClick={() => setModal({ type: 'special' })} className="btn-secondary">
                <PlusCircle size={16} />
                Puente / Esp.
              </button>
              <button onClick={() => setModal({ type: 'festivo' })} className="btn-primary">
                <Plus size={16} />
                Añadir festivo
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filtros por tipo */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterTipo('all')}
          className={`badge px-3 py-1 cursor-pointer ${filterTipo === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Todos ({holidays.length})
        </button>
        {TIPO_ORDER.map(tipo => {
          const count = holidays.filter(h => h.tipo === tipo).length
          if (count === 0) return null
          return (
            <button
              key={tipo}
              onClick={() => setFilterTipo(tipo)}
              className={`badge px-3 py-1 cursor-pointer ${filterTipo === tipo ? 'bg-gray-800 text-white' : TIPO_COLORS[tipo] + ' hover:opacity-80'}`}
            >
              {TIPO_LABELS[tipo]} ({count})
            </button>
          )
        })}
      </div>

      {/* Tabla agrupada por mes */}
      <div className="space-y-6">
        {Object.entries(byMonth).sort(([a],[b]) => Number(a)-Number(b)).map(([mes, items]) => (
          <div key={mes} className="card overflow-hidden p-0">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">{MESES[Number(mes)-1]}</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-100">
              <tbody className="divide-y divide-gray-100 bg-white">
                {items.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="table-td w-28 text-gray-500 font-mono text-xs">
                      {new Date(h.fecha + 'T00:00:00').toLocaleDateString('es-ES',{
                        weekday:'short', day:'2-digit', month:'2-digit'
                      })}
                    </td>
                    <td className="table-td font-medium text-gray-900">{h.nombre}</td>
                    <td className="table-td">
                      <span className={`badge ${TIPO_COLORS[h.tipo]}`}>{TIPO_LABELS[h.tipo]}</span>
                    </td>
                    <td className="table-td hidden sm:table-cell text-gray-400 text-xs">
                      {h.es_recurrente ? 'Anual' : 'Puntual'}
                    </td>
                    <td className="table-td hidden md:table-cell text-gray-400 text-xs truncate max-w-xs">
                      {h.notas}
                    </td>
                    {canEdit && (
                      <td className="table-td w-10">
                        <button onClick={() => setModal({ type: 'festivo', holiday: h })}
                          className="text-gray-400 hover:text-blue-600"><Pencil size={14} /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card text-center py-12 text-gray-400">
            No hay festivos configurados para {anio}.
          </div>
        )}
      </div>

      {/* Días especiales */}
      {specialDays.length > 0 && (
        <div className="mt-8 card overflow-hidden p-0">
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-amber-700">Días especiales / Puentes ({anio})</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-100">
            <tbody className="divide-y divide-gray-100 bg-white">
              {specialDays.map(sd => (
                <tr key={sd.id} className="hover:bg-gray-50">
                  <td className="table-td w-28 text-gray-500 font-mono text-xs">
                    {new Date(sd.fecha + 'T00:00:00').toLocaleDateString('es-ES',{
                      weekday:'short', day:'2-digit', month:'2-digit'
                    })}
                  </td>
                  <td className="table-td">
                    <span className="badge bg-amber-100 text-amber-800">
                      {sd.tipo_override === 'puente' ? 'Puente' :
                       sd.tipo_override === 'vispera' ? 'Víspera' : 'Festivo especial'}
                    </span>
                  </td>
                  <td className="table-td text-gray-500">{sd.motivo ?? '—'}</td>
                  {canEdit && (
                    <td className="table-td w-10">
                      <button onClick={() => setModal({ type: 'special', day: sd })}
                        className="text-gray-400 hover:text-blue-600"><Pencil size={14} /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'festivo' && (
        <FestivoFormModal
          holiday={modal.holiday}
          defaultAnio={anio}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {modal?.type === 'special' && (
        <SpecialDayModal
          specialDay={modal.day}
          defaultAnio={anio}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
