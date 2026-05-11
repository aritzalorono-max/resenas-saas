'use client'

import { useState, useEffect, useTransition } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { listAusencias, setAusencia, deleteAusencia } from '@/lib/actions/ausencias'
import { type Doctor, type TipoAusencia, TIPO_AUSENCIA_BG } from '@/types'

const TIPOS: TipoAusencia[] = ['Vacaciones', 'Baja', 'Excedencia', 'Congreso', 'Otros']

const TIPO_PILL_ACTIVE: Record<TipoAusencia, string> = {
  Vacaciones: 'bg-sky-500 text-white border-sky-500',
  Baja:       'bg-red-500 text-white border-red-500',
  Excedencia: 'bg-amber-500 text-white border-amber-500',
  Congreso:   'bg-purple-500 text-white border-purple-500',
  Otros:      'bg-gray-400 text-white border-gray-400',
}

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const d = new Date(year, month, 1)
  while (d.getMonth() === month) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

function dow(d: Date): number {
  return (d.getDay() + 6) % 7
}

export function CalendarioModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const hoy = new Date()
  const todayStr = toDateStr(hoy)
  const [mes, setMes] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1))
  const [tipo, setTipo] = useState<TipoAusencia>('Vacaciones')
  const [ausencias, setAusenciasMap] = useState<Map<string, TipoAusencia>>(new Map())
  const [saving, setSaving] = useState<Set<string>>(new Set())
  const [, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const data = await listAusencias(doctor.id)
      const map = new Map<string, TipoAusencia>()
      data.forEach(a => map.set(a.fecha, a.tipo))
      setAusenciasMap(map)
    })
  }, [doctor.id])

  async function handleDay(fecha: string) {
    if (saving.has(fecha)) return
    setSaving(prev => new Set(prev).add(fecha))
    const current = ausencias.get(fecha)
    const next = new Map(ausencias)
    if (current === tipo) {
      await deleteAusencia(doctor.id, fecha)
      next.delete(fecha)
    } else {
      await setAusencia(doctor.id, fecha, tipo)
      next.set(fecha, tipo)
    }
    setAusenciasMap(next)
    setSaving(prev => { const s = new Set(prev); s.delete(fecha); return s })
  }

  const year = mes.getFullYear()
  const month = mes.getMonth()
  const days = getDaysInMonth(year, month)
  const offset = dow(days[0])
  const monthLabel = mes.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  const totales = TIPOS.map(t => ({ t, n: [...ausencias.values()].filter(v => v === t).length })).filter(x => x.n > 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{doctor.nombre}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Haz clic en los días para marcarlos</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Tipo selector */}
          <div className="flex flex-wrap gap-2">
            {TIPOS.map(t => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  tipo === t
                    ? TIPO_PILL_ACTIVE[t]
                    : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Navegación de mes */}
          <div className="flex items-center justify-between">
            <button onClick={() => setMes(new Date(year, month - 1, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold capitalize text-gray-800">{monthLabel}</span>
            <button onClick={() => setMes(new Date(year, month + 1, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Calendario */}
          <div className="grid grid-cols-7 gap-1">
            {DIAS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 pb-1">{d}</div>
            ))}
            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
            {days.map(day => {
              const fecha = toDateStr(day)
              const tipoDay = ausencias.get(fecha)
              const isSaving = saving.has(fecha)
              const isToday = fecha === todayStr

              return (
                <button
                  key={fecha}
                  onClick={() => handleDay(fecha)}
                  disabled={isSaving}
                  title={tipoDay ?? tipo}
                  className={[
                    'aspect-square rounded-lg text-xs font-medium transition-all flex items-center justify-center select-none',
                    tipoDay
                      ? `${TIPO_AUSENCIA_BG[tipoDay]} text-white`
                      : 'text-gray-700 hover:bg-gray-100',
                    isToday && !tipoDay ? 'ring-2 ring-offset-1 ring-blue-400' : '',
                    isSaving ? 'opacity-50 cursor-wait' : 'cursor-pointer',
                  ].join(' ')}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>

          {/* Resumen */}
          {totales.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
              {totales.map(({ t, n }) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className={`w-2.5 h-2.5 rounded-full ${TIPO_AUSENCIA_BG[t]}`} />
                  {t}: <span className="font-semibold">{n}d</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
