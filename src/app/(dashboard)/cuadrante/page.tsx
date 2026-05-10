// @ts-nocheck
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/actions/auth'
import { listDoctors } from '@/lib/actions/doctors'
import { getRulesConfig } from '@/lib/actions/cuadrante'
import { CuadranteClient } from '@/components/cuadrante/CuadranteClient'

export const metadata = { title: 'Cuadrante · Guardias Urología' }

export default async function CuadrantePage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  const [doctors, rules] = await Promise.all([
    listDoctors(),
    getRulesConfig(),
  ])

  const activeDoctors = doctors.filter(d => d.activo)

  return (
    <CuadranteClient
      currentRole={profile.role}
      activeDoctors={activeDoctors}
      initialRules={rules}
    />
  )
}
