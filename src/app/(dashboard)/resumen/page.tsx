import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResumenClient } from '@/components/resumen/ResumenClient'

export default async function ResumenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre_servicio')
    .eq('id', user.id)
    .single()

  const serviceName = profile?.nombre_servicio?.trim() || 'Guardias'

  return <ResumenClient serviceName={serviceName} />
}
