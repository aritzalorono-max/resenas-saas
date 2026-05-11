import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre_servicio')
    .eq('id', user.id)
    .single()

  const serviceName = profile?.nombre_servicio?.trim() || 'Guardias'

  return (
    <div className="min-h-screen bg-slate-50">
      <Header serviceName={serviceName} />
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
