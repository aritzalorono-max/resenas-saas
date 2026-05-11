import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MedicosClient } from '@/components/medicos/MedicosClient'
import { type Doctor } from '@/types'

export default async function MedicosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('doctors')
    .select('*')
    .eq('profile_id', user.id)
    .order('categoria')
    .order('nombre')

  return <MedicosClient doctors={(data ?? []) as Doctor[]} />
}
