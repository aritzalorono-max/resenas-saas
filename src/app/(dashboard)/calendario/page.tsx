import { listHolidays, listSpecialDays } from '@/lib/actions/holidays'
import { listPenosidadConfig } from '@/lib/actions/penosidad'
import { CalendarioView } from '@/components/calendario/CalendarioView'

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ anio?: string; mes?: string }>
}) {
  const params = await searchParams
  const now    = new Date()
  const anio   = Number(params.anio ?? now.getFullYear())
  const mes    = Number(params.mes  ?? (now.getMonth() + 1))

  // Load holidays for this month + adjacents (for víspera detection across month borders)
  const prevMes  = mes === 1  ? 12 : mes - 1
  const nextMes  = mes === 12 ? 1  : mes + 1
  const prevAnio = mes === 1  ? anio - 1 : anio
  const nextAnio = mes === 12 ? anio + 1 : anio

  const [allHolidays, specialDays, penosidad] = await Promise.all([
    Promise.all([
      listHolidays(prevAnio),
      listHolidays(anio),
      listHolidays(nextAnio),
    ]).then(([a,b,c]) => [...a, ...b, ...c].filter((h,i,arr) => arr.findIndex(x => x.id === h.id) === i)),
    listSpecialDays(anio),
    listPenosidadConfig(),
  ])

  return (
    <CalendarioView
      holidays={allHolidays}
      specialDays={specialDays}
      penosidad={penosidad}
      anio={anio}
      mes={mes}
    />
  )
}
