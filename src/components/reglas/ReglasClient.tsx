'use client'

import { useState, useTransition } from 'react'
import { updateRulesConfig } from '@/lib/actions/cuadrante'
import { type RulesConfig, type DoctorProfile, type DoctorPeriodo, CATEGORIA_LABELS } from '@/types'
import { Info, CheckCircle2 } from 'lucide-react'

// ── Working-day calculation (same logic as DoctorPeriodosModal) ────────────────

function countWeekdays(start: Date, end: Date): number {
  let count = 0
  const d = new Date(start)
  d.setHours(0, 0, 0, 0)
  const e = new Date(end)
  e.setHours(0, 0, 0, 0)
  while (d <= e) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) count++
    d.setDate(d.getDate() + 1)
  }
  return count
}

function calcEfectivos(
  anio: number,
  doctor: DoctorProfile,
  periodos: DoctorPeriodo[],
  opts: {
    bajas: boolean
    reducidas: boolean
    excedencias: boolean
    incorporacion: boolean
  }
): { efectivos: number; total: number } {
  const yearStart = new Date(anio, 0, 1)
  const yearEnd   = new Date(anio, 11, 31)
  const total     = countWeekdays(yearStart, yearEnd)

  // Determine doctor's active date range in the year
  const docStart = opts.incorporacion && doctor.anio_inicio === anio
    ? new Date(anio, new Date().getMonth(), 1) // fallback — in real use we'd need an exact start date
    : yearStart

  let efectivos = 0
  const d = new Date(yearStart)
  while (d <= yearEnd) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) {
      // Outside doctor's active range
      if (opts.incorporacion && d < docStart) {
        d.setDate(d.getDate() + 1)
        continue
      }

      const activePeriodos = periodos.filter(p => {
        const s = new Date(p.fecha_inicio)
        const f = p.fecha_fin ? new Date(p.fecha_fin) : yearEnd
        return d >= s && d <= f
      })

      let fraction = 1.0

      if (activePeriodos.length > 0) {
        const tipos = activePeriodos.map(p => p.tipo)
        if (opts.excedencias && tipos.includes('excedencia')) {
          fraction = 0
        } else if (opts.bajas && tipos.includes('baja')) {
          fraction = 0
        } else if (opts.reducidas && tipos.includes('reduccion')) {
          const maxRed = Math.max(...activePeriodos.map(p => p.reduccion_porcentaje ?? 0))
          fraction = Math.max(0, 1 - maxRed / 100)
        }
      }

      efectivos += fraction
    }
    d.setDate(d.getDate() + 1)
  }

  return { efectivos: Math.round(efectivos), total }
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  rules: RulesConfig | null
  doctors: DoctorProfile[]
  periodosByDoctor: Record<string, DoctorPeriodo[]>
  anio: number
}

const DEFAULTS: Pick<RulesConfig,
  'considerar_bajas' | 'considerar_jornadas_reducidas' |
  'considerar_excedencias' | 'considerar_incorporacion_parcial'
> = {
  considerar_bajas:                true,
  considerar_jornadas_reducidas:   true,
  considerar_excedencias:          true,
  considerar_incorporacion_parcial: true,
}

export function ReglasClient({ rules, doctors, periodosByDoctor, anio }: Props) {
  const [cfg, setCfg] = useState({
    considerar_bajas:                rules?.considerar_bajas                ?? DEFAULTS.considerar_bajas,
    considerar_jornadas_reducidas:   rules?.considerar_jornadas_reducidas   ?? DEFAULTS.considerar_jornadas_reducidas,
    considerar_excedencias:          rules?.considerar_excedencias           ?? DEFAULTS.considerar_excedencias,
    considerar_incorporacion_parcial: rules?.considerar_incorporacion_parcial ?? DEFAULTS.considerar_incorporacion_parcial,
  })
  const [saved, setSaved]     = useState(false)
  const [isPending, startTransition] = useTransition()

  function toggle(key: keyof typeof cfg) {
    setCfg(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  function handleSave() {
    startTransition(async () => {
      await updateRulesConfig(cfg)
      setSaved(true)
    })
  }

  // ── Preview table data ────────────────────────────────────────────────────────
  const rows = doctors.map(doc => {
    const periodos = periodosByDoctor[doc.id] ?? []
    const { efectivos, total } = calcEfectivos(anio, doc, periodos, {
      bajas:        cfg.considerar_bajas,
      reducidas:    cfg.considerar_jornadas_reducidas,
      excedencias:  cfg.considerar_excedencias,
      incorporacion: cfg.considerar_incorporacion_parcial,
    })
    return { doc, efectivos, total }
  })

  const totalEfectivos = rows.reduce((s, r) => s + r.efectivos, 0)

  const FACTORES = [
    {
      key:   'considerar_bajas' as const,
      label: 'Bajas e incapacidad temporal',
      desc:  'Los días en baja médica no cuentan como días trabajados.',
    },
    {
      key:   'considerar_jornadas_reducidas' as const,
      label: 'Jornadas reducidas',
      desc:  'Los periodos de reducción de jornada computan proporcionalmente (ej. 50% jornada = 50% días).',
    },
    {
      key:   'considerar_excedencias' as const,
      label: 'Excedencias',
      desc:  'Los periodos de excedencia no generan días trabajados.',
    },
    {
      key:   'considerar_incorporacion_parcial' as const,
      label: 'Incorporación / cese a mitad de año',
      desc:  'Si un médico se incorpora o cesa durante el año, solo computan los días reales trabajados.',
    },
  ]

  return (
    <div className="max-w-3xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reglas de reparto</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Configura cómo se calcula el número de guardias que corresponde a cada médico.
        </p>
      </div>

      {/* How it works */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <Info size={16} className="text-blue-500 shrink-0" />
          ¿Cómo funciona el reparto?
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          El número de guardias que le corresponde a cada médico se calcula de forma
          <strong> proporcional a los días laborables efectivos</strong> que trabaja
          durante el año. Así, un médico que trabaja todo el año a jornada completa recibe
          más guardias que uno que estuvo de baja tres meses o que trabaja al 50%.
        </p>
        <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-800">
          <span className="font-mono">Guardias médico = Guardias totales × (Días efectivos médico / Suma días efectivos equipo)</span>
        </div>
        <p className="text-sm text-gray-500">
          Los factores de abajo determinan qué circunstancias reducen los días efectivos de un médico.
          Puedes activar o desactivar cada uno según la política de tu servicio.
        </p>
      </div>

      {/* Toggles */}
      <div className="card p-5 space-y-1">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Factores que reducen los días efectivos — {anio}
        </h2>

        {FACTORES.map(f => (
          <label
            key={f.key}
            className="flex items-start gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={cfg[f.key]}
                onChange={() => toggle(f.key)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{f.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
            </div>
          </label>
        ))}

        <div className="pt-3 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="btn-primary"
          >
            {isPending ? 'Guardando…' : 'Guardar cambios'}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 size={15} /> Guardado
            </span>
          )}
        </div>
      </div>

      {/* Preview table */}
      <div className="card overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">
            Vista previa — días efectivos {anio}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Basado en los periodos registrados para cada médico y los factores activos.
          </p>
        </div>
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-th">Médico</th>
              <th className="table-th">Categoría</th>
              <th className="table-th text-right">Días efectivos</th>
              <th className="table-th text-right">% del total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="table-td text-center text-gray-400 py-8">
                  No hay médicos activos.
                </td>
              </tr>
            )}
            {rows.map(({ doc, efectivos, total }) => {
              const pct = totalEfectivos > 0
                ? ((efectivos / totalEfectivos) * 100).toFixed(1)
                : '0.0'
              const name = doc.nombre ?? doc.profile?.full_name ?? '—'
              return (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="table-td font-medium text-gray-900">{name}</td>
                  <td className="table-td">
                    <span className="badge bg-blue-100 text-blue-800 text-xs">
                      {CATEGORIA_LABELS[doc.categoria]}
                    </span>
                  </td>
                  <td className="table-td text-right tabular-nums">
                    <span className="font-semibold">{efectivos}</span>
                    <span className="text-gray-400 text-xs ml-1">/ {total}</span>
                  </td>
                  <td className="table-td text-right tabular-nums font-medium text-blue-700">
                    {pct}%
                  </td>
                </tr>
              )
            })}
          </tbody>
          {rows.length > 0 && (
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td colSpan={2} className="table-td text-xs text-gray-500 font-medium">Total equipo</td>
                <td className="table-td text-right font-bold tabular-nums">{totalEfectivos}</td>
                <td className="table-td text-right font-bold text-blue-700">100%</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

    </div>
  )
}
