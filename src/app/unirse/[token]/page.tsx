import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getInvitationByToken, getTeamByCodigo } from '@/lib/actions/teams'
import { JoinByCodeButton } from '@/components/onboarding/JoinByCodeButton'
import { InviteRegisterForm } from '@/components/onboarding/InviteRegisterForm'
import { Stethoscope, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ token: string }>
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Guardias</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

function isShortCode(token: string) {
  return token.length <= 8
}

export default async function UnirseTokenPage({ params }: Props) {
  const { token } = await params

  // Handle shareable team code link (e.g. /unirse/ABC-123)
  if (isShortCode(token)) {
    const team = await getTeamByCodigo(token)
    if (!team) {
      return (
        <PageShell>
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Equipo no encontrado</h2>
            <p className="text-gray-500 text-sm mb-6">
              El código <span className="font-mono font-bold">{token.toUpperCase()}</span> no corresponde a ningún equipo.
            </p>
            <Link href="/login" className="btn-primary">Ir al inicio de sesión</Link>
          </div>
        </PageShell>
      )
    }
    // Check if logged in — if yes, show join button; if no, go to registro with code pre-filled
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      redirect(`/registro?codigo=${encodeURIComponent(token.toUpperCase())}`)
    }
    return (
      <PageShell>
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Únete al equipo</h2>
          <p className="text-gray-500 text-sm mb-6">
            <strong className="text-gray-900">{team.nombre}</strong>
            {team.hospital ? ` · ${team.hospital}` : ''}
          </p>
          <JoinByCodeButton codigo={token} />
        </div>
      </PageShell>
    )
  }

  // Handle email invitation link (UUID token)
  const invitation = await getInvitationByToken(token)

  if (!invitation) {
    return (
      <PageShell>
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invitación no válida</h2>
          <p className="text-gray-500 text-sm mb-6">
            Este enlace ha caducado, ya fue utilizado, o no existe.
          </p>
          <Link href="/login" className="btn-primary">Ir al inicio de sesión</Link>
        </div>
      </PageShell>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in → redirect to /registro with email + team code pre-filled
  if (!user) {
    const team = invitation.team as any
    const params = new URLSearchParams({
      email:  invitation.email,
      invite: token,
    })
    if (team?.codigo) params.set('codigo', team.codigo)
    redirect(`/registro?${params}`)
  }

  // Already logged in → redirect to accept invitation
  redirect(`/dashboard`)
}
