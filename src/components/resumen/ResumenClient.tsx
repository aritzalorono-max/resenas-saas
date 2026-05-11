'use client'

import { useState, useEffect, useTransition } from 'react'
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import { getResumenMes, type ResumenDoctor } from '@/lib/actions/resumen'
import { TIPO_AUSENCIA_BG, TIPO_PERIODO_LABEL, type TipoAusencia } from '@/types'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MESES_CORTO = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

function agruparFechas(fechas: string[], month: number): string {
  if (fechas.length === 0) return ''
  const sorted = [...fechas].sort()
  const ranges: string[] = []
  let ini = sorted[0]
  let fin = sorted[0]

  for (let i = 1; i <= sorted.length; i++) {
    const curr = sorted[i]
    const finDate = new Date(fin + 'T00:00:00')
    const currDate = curr ? new Date(curr + 'T00:00:00') : null
    const isConsec = currDate && currDate.getTime() - finDate.getTime() === 86400000

    if (isConsec) {
      fin = curr
    } else {
      const d1 = parseInt(ini.split('-')[2])
      const d2 = parseInt(fin.split('-')[2])
      ranges.push(d1 === d2 ? `${d1}` : `${d1}-${d2}`)
      ini = curr
      fin = curr
    }
  }
  return `${ranges.join(', ')} ${MESES_CORTO[month]}`
}

function contarDiasPeriodo(fechaInicio: string, fechaFin: string, year: number, month: number): number {
  const mesStart = new Date(year, month, 1)
  const mesEnd   = new Date(year, month + 1, 0)
  const s = new Date(Math.max(new Date(fechaInicio + 'T00:00:00').getTime(), mesStart.getTime()))
  const e = new Date(Math.min(new Date(fechaFin   + 'T00:00:00').getTime(), mesEnd.getTime()))
  return Math.max(0, Math.floor((e.getTime() - s.getTime()) / 86400000) + 1)
}

function fmtPeriodo(p: { fecha_inicio: string; fecha_fin: string }): string {
  const fmt = (d: string) => d.split('-').reverse().join('/')
  return `${fmt(p.fecha_inicio)} → ${fmt(p.fecha_fin)}`
}

function generarTexto(r: ResumenDoctor, mes: string, year: number, month: number): string {
  const cat = r.doctor.categoria === 'Adjunto' ? 'Adjunto' : `Residente ${r.doctor.categoria}`
  const lines: string[] = [`${r.doctor.nombre} (${cat})`]

  for (const a of r.ausencias) {
    const dias = a.fechas.length
    lines.push(`  ${a.tipo}: ${dias} día${dias !== 1 ? 's' : ''} (${agruparFechas(a.fechas, month)})`)
  }
  for (const p of r.periodos) {
    const dias = contarDiasPeriodo(p.fecha_inicio, p.fecha_fin, year, month)
    lines.push(`  ${TIPO_PERIODO_LABEL[p.tipo]}: ${dias} día${dias !== 1 ? 's' : ''} (${fmtPeriodo(p)})`)
  }
  return lines.join('\n')
}

function TarjetaDoctor({
  r, year, month, mes, serviceName,
}: {
  r: ResumenDoctor
  year: number
  month: number
  mes: string
  serviceName: string
}) {
  const [copiado, setCopiado] = useState(false)

  function copiar() {
    const cabecera = `RESUMEN ${mes.toUpperCase()} ${year} — ${serviceName}\n\n`
    navigator.clipboard.writeText(cabecera + generarTexto(r, mes, year, month))
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{r.doctor.nombre}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {r.doctor.categoria === 'Adjunto' ? 'Médico Adjunto' : `Residente ${r.doctor.categoria}`}
          </p>
        </div>
        <button
          onClick={copiar}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
        >
          {copiado ? <><Check size={13} className="text-green-500" /> Copiado</> : <><Copy size={13} /> Copiar</>}
        </button>
      </div>

      <div className="space-y-1.5">
        {r.ausencias.map(a => (
          <div key={a.tipo} className="flex items-center gap-2 text-xs text-gray-700">
            <span className={`w-2 h-2 rounded-full shrink-0 ${TIPO_AUSENCIA_BG[a.tipo]}`} />
            <span className="font-medium w-24 shrink-0">{a.tipo}</span>
            <span className="text-gray-500">{a.fechas.length} día{a.fechas.length !== 1 ? 's' : ''}</span>
            <span className="text-gray-400">({agruparFechas(a.fechas, month)})</span>
          </div>
        ))}
        {r.periodos.map(p => {
          const dias = contarDiasPeriodo(p.fecha_inicio, p.fecha_fin, year, month)
          return (
            <div key={p.id} className="flex items-center gap-2 text-xs text-gray-700">
              <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
              <span className="font-medium w-24 shrink-0">{TIPO_PERIODO_LABEL[p.tipo]}</span>
              <span className="text-gray-500">{dias} día{dias !== 1 ? 's' : ''}</span>
              <span className="text-gray-400">({fmtPeriodo(p)})</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ResumenClient({ serviceName }: { serviceName: string }) {
  const hoy = new Date()
  const [year,  setYear]  = useState(hoy.getFullYear())
  const [month, setMonth] = useState(hoy.getMonth())
  const [data,  setData]  = useState<ResumenDoctor[]>([])
  const [copiadoTodo, setCopiadoTodo] = useState(false)
  const [isPending, startTransition]  = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await getResumenMes(year, month)
      setData(res)
    })
  }, [year, month])

  function prevMes() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMes() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function copiarTodo() {
    if (data.length === 0) return
    const mes = `${MESES[month]} ${year}`
    const cabecera = `RESUMEN ${mes.toUpperCase()} — ${serviceName}\n`
    const separador = '─'.repeat(40)
    const cuerpo = data.map(r => generarTexto(r, mes, year, month)).join('\n\n')
    navigator.clipboard.writeText(`${cabecera}${separador}\n\n${cuerpo}`)
    setCopiadoTodo(true)
    setTimeout(() => setCopiadoTodo(false), 2000)
  }

  const mes = MESES[month]

  return (
    <>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumen mensual</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ausencias y periodos por médico</p>
        </div>
        {data.length > 0 && (
          <button onClick={copiarTodo}
            className="flex items-center gap-2 btn-primary">
            {copiadoTodo ? <><Check size={15} /> Copiado</> : <><Copy size={15} /> Copiar todo</>}
          </button>
        )}
      </div>

      {/* Navegación de mes */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button onClick={prevMes} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          <ChevronLeft size={20} />
        </button>
        <span className="text-lg font-semibold text-gray-800 w-44 text-center">{mes} {year}</span>
        <button onClick={nextMes} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Contenido */}
      {isPending ? (
        <div className="text-center py-16 text-sm text-gray-400">Cargando…</div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-sm">No hay ausencias ni periodos en {mes.toLowerCase()} {year}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map(r => (
            <TarjetaDoctor key={r.doctor.id} r={r} year={year} month={month} mes={mes} serviceName={serviceName} />
          ))}
        </div>
      )}
    </>
  )
}
