// @ts-nocheck
import { redirect } from 'next/navigation'
import { getCurrentProfile, listProfiles } from '@/lib/actions/auth'
import { listDoctors, listAllShiftCounters, getShiftCounters, getDoctorProfile } from '@/lib/actions/doctors'
import { listHolidays } from '@/lib/actions/holidays'
import { listExtras, listAbsences } from '@/lib/actions/medico'
import { MedicoDashboard } from '@/components/dashboard/MedicoDashboard'
import { Users, CalendarCheck, Star, TrendingUp, AlertCircle } from 'lucide-react'

function StatCard({ label, value, sub, icon, color }) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const anioActual = new Date().getFullYear()
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  // ── Panel personal para el médico ──────────────────────────────────────────
  if (profile.role === 'medico') {
    const [doctor, counters, extras, absences] = await Promise.all([
      getDoctorProfile(profile.id),
      getShiftCounters(profile.id, anioActual),
      listExtras(profile.id, anioActual),
      listAbsences(profile.id, anioActual),
    ])

    return (
      <MedicoDashboard
        profileId={profile.id}
        fullName={profile.full_name}
        doctor={doctor}
        counters={counters}
        extras={extras}
        absences={absences}
        anio={anioActual}
      />
    )
  }

  // ── Panel de equipo para admin/gestor ──────────────────────────────────────
  const [doctors, profiles, holidaysAnio, counters] = await Promise.all([
    listDoctors(),
    listProfiles(),
    listHolidays(anioActual),
    listAllShiftCounters(anioActual),
  ])

  const activeDoctors = doctors.filter(d => d.activo)
  const totalGuardias = counters.reduce((s, c) => s + c.total_guardias, 0)
  const totalPuntos   = counters.reduce((s, c) => s + Number(c.puntos_acumulados), 0)
  const festivosAnio  = holidaysAnio.length

  const rankingCounters = [...counters]
    .sort((a, b) => b.total_guardias - a.total_guardias)
    .slice(0, 5)

  function nombrePorId(profileId: string) {
    return profiles.find(p => p.id === profileId)?.full_name ?? '—'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido/a, {profile.full_name?.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-1">
          Resumen del Servicio de Urología · Año {anioActual}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Médicos activos" value={activeDoctors.length} sub={`${doctors.length} en total`}
          icon={<Users size={20} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard label="Guardias asignadas" value={totalGuardias} sub={`Año ${anioActual}`}
          icon={<CalendarCheck size={20} className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard label="Festivos configurados" value={festivosAnio} sub={`Año ${anioActual}`}
          icon={<Star size={20} className="text-amber-600" />} color="bg-amber-50" />
        <StatCard label="Puntos acumulados" value={totalPuntos.toFixed(1)} sub="Suma del servicio"
          icon={<TrendingUp size={20} className="text-purple-600" />} color="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Top médicos por guardias ({anioActual})
          </h2>
          {rankingCounters.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-400 py-4">
              <AlertCircle size={16} />
              <span className="text-sm">Aún no hay guardias registradas.</span>
            </div>
          ) : (
            <ol className="space-y-3">
              {rankingCounters.map((c, i) => (
                <li key={c.id} className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-amber-100 text-amber-700' :
                    i === 1 ? 'bg-slate-100 text-slate-600' :
                    i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                  }`}>{i + 1}</span>
                  <span className="flex-1 text-sm text-gray-700 truncate">{nombrePorId(c.profile_id)}</span>
                  <span className="text-sm font-semibold text-gray-900">{c.total_guardias}</span>
                  <span className="text-xs text-gray-400">({Number(c.puntos_acumulados).toFixed(1)} pts)</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {rankingCounters.length > 0 && (
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Distribución por tipo de día ({anioActual})
            </h2>
            {[
              { label: 'Festivos especiales', key: 'guardias_festivo_especial', color: 'bg-red-500' },
              { label: 'Domingos',            key: 'guardias_domingo',          color: 'bg-orange-400' },
              { label: 'Festivos',            key: 'guardias_festivo',          color: 'bg-amber-400' },
              { label: 'Sábados',             key: 'guardias_sabado',           color: 'bg-green-400' },
              { label: 'Vísperas',            key: 'guardias_vispera',          color: 'bg-lime-400' },
              { label: 'Laborables',          key: 'guardias_laborable',        color: 'bg-blue-400' },
            ].map(({ label, key, color }) => {
              const total = counters.reduce((s, c) => s + (c[key] ?? 0), 0)
              const pct   = totalGuardias > 0 ? Math.round((total / totalGuardias) * 100) : 0
              return (
                <div key={key} className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-600 w-36 shrink-0">{label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-2 ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-10 text-right">{total}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
