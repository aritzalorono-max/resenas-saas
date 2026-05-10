'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { type Holiday, type SpecialDay, type PenosidadConfig, type DayTipo } from '@/types'

interface CalendarDay {
  date: Date
  tipo: DayTipo
  festivo?: string
  isCurrentMonth: boolean
  isToday: boolean
}

interface Props {
  holidays: Holiday[]
  specialDays: SpecialDay[]
  penosidad: PenosidadConfig[]
  anio: number
  mes: number   // 1-12
}

function classifyDay(
  date: Date,
  holidays: Holiday[],
  specialDays: SpecialDay[],
): DayTipo {
  const iso  = date.toISOString().split('T')[0]
  const dow  = date.getDay() // 0=dom 6=sab

  // Manual override
  const special = specialDays.find(s => s.fecha === iso)
  if (special) return special.tipo_override as DayTipo

  const dayHolidays = holidays.filter(h => h.fecha === iso)

  if (dayHolidays.some(h => h.tipo === 'especial')) return 'festivo_especial'
  if (dayHolidays.length > 0) return 'festivo'
  if (dow === 0) return 'domingo'
  if (dow === 6) return 'sabado'

  // Víspera: tomorrow is a holiday?
  const tomorrow = new Date(date)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowIso = tomorrow.toISOString().split('T')[0]
  if (holidays.some(h => h.fecha === tomorrowIso)) return 'vispera'

  return 'laborable'
}

function festivo(date: Date, holidays: Holiday[]): string | undefined {
  const iso = date.toISOString().split('T')[0]
  const match = holidays
    .filter(h => h.fecha === iso)
    .sort((a,b) => {
      const order: Record<string, number> = { especial:1, nacional:2, euskadi:3, bizkaia:4, galdakao:5 }
      return (order[a.tipo] ?? 6) - (order[b.tipo] ?? 6)
    })[0]
  return match?.nombre
}

export function CalendarioView({ holidays, specialDays, penosidad, anio, mes }: Props) {
  const router = useRouter()

  const colorMap = Object.fromEntries(penosidad.map(p => [p.tipo_dia, p.color])) as Record<DayTipo, string>
  const labelMap = Object.fromEntries(penosidad.map(p => [p.tipo_dia, p.etiqueta])) as Record<DayTipo, string>

  function navigate(delta: number) {
    let nm = mes + delta
    let ny = anio
    if (nm < 1)  { nm = 12; ny-- }
    if (nm > 12) { nm = 1;  ny++ }
    router.push(`/calendario?anio=${ny}&mes=${nm}`)
  }

  // Build calendar grid (6 weeks × 7 days)
  const firstDay  = new Date(anio, mes - 1, 1)
  const lastDay   = new Date(anio, mes, 0)
  const today     = new Date()
  today.setHours(0, 0, 0, 0)

  // Start Monday (European convention)
  const startDow = (firstDay.getDay() + 6) % 7 // 0=Mon
  const days: CalendarDay[] = []

  for (let i = 0; i < startDow; i++) {
    const d = new Date(firstDay)
    d.setDate(d.getDate() - (startDow - i))
    days.push({
      date: d,
      tipo: classifyDay(d, holidays, specialDays),
      festivo: festivo(d, holidays),
      isCurrentMonth: false,
      isToday: d.getTime() === today.getTime(),
    })
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(anio, mes - 1, d)
    days.push({
      date,
      tipo: classifyDay(date, holidays, specialDays),
      festivo: festivo(date, holidays),
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
    })
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(lastDay)
    d.setDate(d.getDate() + i)
    days.push({
      date: d,
      tipo: classifyDay(d, holidays, specialDays),
      festivo: festivo(d, holidays),
      isCurrentMonth: false,
      isToday: d.getTime() === today.getTime(),
    })
  }

  // Stats for this month
  const monthDays = days.filter(d => d.isCurrentMonth)
  const statsByTipo = penosidad.map(p => ({
    ...p,
    count: monthDays.filter(d => d.tipo === p.tipo_dia).length,
  })).filter(s => s.count > 0)

  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const DIAS  = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <p className="text-gray-500 mt-1">Vista mensual con clasificación de días</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="btn-secondary p-2"><ChevronLeft size={18} /></button>
          <span className="text-base font-semibold text-gray-900 px-3 min-w-[160px] text-center">
            {MESES[mes - 1]} {anio}
          </span>
          <button onClick={() => navigate(1)} className="btn-secondary p-2"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Estadísticas del mes */}
      <div className="flex flex-wrap gap-2">
        {statsByTipo.map(s => (
          <div key={s.tipo_dia}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm"
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-600">{s.etiqueta}</span>
            <span className="text-xs font-bold text-gray-900">{s.count}</span>
          </div>
        ))}
      </div>

      {/* Cuadrícula del calendario */}
      <div className="card overflow-hidden p-0">
        {/* Cabecera días semana */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
          {DIAS.map(d => (
            <div key={d} className={`py-2 text-center text-xs font-semibold ${
              d === 'Sáb' || d === 'Dom' ? 'text-blue-500' : 'text-gray-500'
            }`}>{d}</div>
          ))}
        </div>

        {/* Días */}
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
          {days.map((day, i) => {
            const color     = colorMap[day.tipo] ?? '#6b7280'
            const isFestivo = day.tipo !== 'laborable' && day.tipo !== 'sabado'

            return (
              <div
                key={i}
                className={`min-h-[72px] sm:min-h-[90px] p-1.5 sm:p-2 flex flex-col ${
                  !day.isCurrentMonth ? 'bg-gray-50/60' : 'bg-white hover:bg-gray-50'
                } ${day.isToday ? 'ring-2 ring-inset ring-blue-500' : ''} transition-colors`}
              >
                {/* Número del día */}
                <div className="flex items-start justify-between mb-1">
                  <span className={`text-xs sm:text-sm font-semibold leading-none ${
                    !day.isCurrentMonth ? 'text-gray-300' :
                    day.isToday ? 'text-blue-600' : 'text-gray-800'
                  }`}>
                    {day.date.getDate()}
                  </span>
                  {/* Pastilla de tipo */}
                  <div
                    className="w-2 h-2 rounded-full shrink-0 mt-0.5"
                    style={{ backgroundColor: day.isCurrentMonth ? color : '#e5e7eb' }}
                    title={labelMap[day.tipo]}
                  />
                </div>

                {/* Nombre del festivo */}
                {day.isCurrentMonth && day.festivo && (
                  <p className="text-[10px] leading-tight text-gray-500 line-clamp-2 mt-0.5">
                    {day.festivo}
                  </p>
                )}

                {/* Tipo de día (pequeño) */}
                {day.isCurrentMonth && !day.festivo && day.tipo !== 'laborable' && (
                  <p className="text-[10px] leading-tight mt-0.5 hidden sm:block"
                    style={{ color }}>
                    {labelMap[day.tipo]}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Info size={14} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700">Leyenda de colores</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {penosidad.map(p => (
            <div key={p.tipo_dia} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-xs text-gray-600">{p.etiqueta}</span>
              <span className="text-xs text-gray-400">({Number(p.puntos_base).toFixed(1)} pts)</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 flex items-start gap-1">
          <span>Las vísperas son el día anterior a un festivo. Los puentes se configuran manualmente en la sección Festivos.</span>
        </p>
      </div>
    </div>
  )
}
