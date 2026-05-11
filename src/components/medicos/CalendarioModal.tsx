'use client'

import { useState, useEffect, useTransition } from 'react'
import { X, ChevronLeft, ChevronRight, Eraser } from 'lucide-react'
import { listAusencias, setAusencia, deleteAusencia, deleteAusenciasMes } from '@/lib/actions/ausencias'
import { listPeriodos } from '@/lib/actions/periodos'
import {
  type Doctor, type TipoAusencia, type TipoPeriodo, type Periodo,
  TIPO_AUSENCIA_BG, TIPO_PERIODO_CAL, TIPO_PERIODO_LABEL,
} from '@/types'

const TIPOS_AUSENCIA: TipoAusencia[] = ['Vacaciones', 'Baja', 'Congreso', 'Otros']

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

function getPeriodoTipo(fecha: string, periodos: Periodo[]): TipoPeriodo | null {
  const d = new Date(fecha + 'T00:00:00')
  for (const p of periodos) {
    const s = new Date(p.fecha_inicio + 'T00:00:00')
    const e = new Date(p.fecha_fin + 'T00:00:00')
    if (d >= s && d <= e) return p.tipo
  }
  return null
}

export function CalendarioModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const hoy = new Date()
  const todayStr = toDateStr(hoy)
  const [mes, setMes] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1))
  const [tipo, setTipo] = useState<TipoAusencia>('Vacaciones')
  const [mode, setMode] = useState<'mark' | 'erase'>('mark')
  const [ausencias, setAusenciasMap] = useState<Map<string, TipoAusencia>>(new Map())
  const [periodos,  setPeriodos]     = useState<Periodo[]>([])
  const [saving, setSaving] = useState<Set<string>>(new Set())
  const [limpiando, setLimpiando] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const [ausData, perData] = await Promise.all([
        listAusencias(doctor.id),
        listPeriodos(doctor.id),
      ])
      const map = new Map<string, TipoAusencia>()
      ausData.forEach(a => map.set(a.fecha, a.tipo))
      setAusenciasMap(map)
      setPeriodos(perData)
    })
  }, [doctor.id])

  async function handleDay(fecha: string) {
    if (saving.has(fecha)) return
    setSaving(prev => new Set(prev).add(fecha))

    if (mode === 'erase') {
      if (ausencias.has(fecha)) {
        await deleteAusencia(doctor.id, fecha)
        setAusenciasMap(prev => { const m = new Map(prev); m.delete(fecha); return m })
      }
      setSaving(prev => { const s = new Set(prev); s.delete(fecha); return s })
      return
    }

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

  async function limpiarMes() {
    setLimpiando(true)
    await deleteAusenciasMes(doctor.id, year, month, tipo)
    setAusenciasMap(prev => {
      const next = new Map(prev)
      for (const [f, t] of prev.entries()) {
        const d = new Date(f + 'T00:00:00')
        if (t === tipo && d.getFullYear() === year && d.getMonth() === month) next.delete(f)
      }
      return next
    })
    setLimpiando(false)
  }

  const year = mes.getFullYear()
  const month = mes.getMonth()
  const days = getDaysInMonth(year, month)
  const offset = dow(days[0])
  const monthLabel = mes.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  const hayTipoEnMes = [...ausencias.entries()].some(([f, t]) => {
    const d = new Date(f + 'T00:00:00')
    return t === tipo && d.getFullYear() === year && d.getMonth() === month
  })

  const totalesAus = TIPOS_AUSENCIA.map(t => ({
    t, n: [...ausencias.entries()]
      .filter(([f, v]) => {
        const d = new Date(f + 'T00:00:00')
        return v === t && d.getFullYear() === year && d.getMonth() === month
      }).length,
  })).filter(x => x.n > 0)

  const periodosMes = periodos.filter(p => {
    const s = new Date(p.fecha_inicio + 'T00:00:00')
    const e = new Date(p.fecha_fin + 'T00:00:00')
    const mesStart = new Date(year, month, 1)
    const mesEnd = new Date(year, month + 1, 0)
    return s <= mesEnd && e >= mesStart
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{doctor.nombre}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Selecciona el tipo y haz clic en los días</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">

          <div className="flex flex-wrap gap-2">
            {TIPOS_AUSENCIA.map(t => (
              <button key={t} onClick={() => { setTipo(t); setMode('mark') }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  tipo === t && mode === 'mark' ? TIPO_PILL_ACTIVE[t] : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                }`}>{t}</button>
            ))}
            <button
              onClick={() => setMode(m => m === 'erase' ? 'mark' : 'erase')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                mode === 'erase' ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
              }`}>
              <Eraser size={12} />
              Borrar
            </button>
          </div>

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

          <div className="grid grid-cols-7 gap-1">
            {DIAS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 pb-1">{d}</div>
            ))}
            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
            {days.map(day => {
              const fecha = toDateStr(day)
              const tipoAus = ausencias.get(fecha)
              const tipoPer = tipoAus ? null : getPeriodoTipo(fecha, periodos)
              const isSaving = saving.has(fecha)
              const isToday = fecha === todayStr
              const isErase = mode === 'erase'
              const bgClass = isErase && tipoAus
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : tipoAus
                  ? `${TIPO_AUSENCIA_BG[tipoAus]} text-white`
                  : tipoPer ? TIPO_PERIODO_CAL[tipoPer] : isErase ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'
              return (
                <button key={fecha}
                  onClick={() => handleDay(fecha)}
                  disabled={isSaving || (isErase && !tipoAus)}
                  title={tipoAus ? (isErase ? `Borrar ${tipoAus}` : tipoAus) : (tipoPer ? `${TIPO_PERIODO_LABEL[tipoPer]} (periodo)` : tipo)}
                  className={[
                    'aspect-square rounded-lg text-xs font-medium transition-all flex items-center justify-center select-none relative',
                    bgClass,
                    isToday && !tipoAus && !tipoPer ? 'ring-2 ring-offset-1 ring-blue-400' : '',
                    isSaving ? 'opacity-50 cursor-wait' : (isErase && !tipoAus) ? 'cursor-default' : 'cursor-pointer',
                  ].join(' ')}>
                  {day.getDate()}
                  {tipoPer && !tipoAus && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-50" />
                  )}
                </button>
              )
            })}
          </div>

          {mode === 'mark' && hayTipoEnMes && (
            <div className="flex justify-end">
              <button onClick={limpiarMes} disabled={limpiando}
                className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
                {limpiando ? 'Limpiando…' : `Limpiar ${tipo.toLowerCase()} de este mes`}
              </button>
            </div>
          )}

          {periodosMes.length > 0 && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Periodos activos</p>
              {periodosMes.map(p => (
                <div key={p.id} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${TIPO_PERIODO_CAL[p.tipo].split(' ')[0]}`} />
                  <span className="font-medium">{TIPO_PERIODO_LABEL[p.tipo]}</span>
                  <span className="text-gray-400">
                    {p.fecha_inicio.split('-').reverse().join('/')} → {p.fecha_fin.split('-').reverse().join('/')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {totalesAus.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-1 border-t border-gray-100">
              {totalesAus.map(({ t, n }) => (
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
