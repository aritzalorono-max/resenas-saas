import Link from 'next/link'
import { getInvitationByToken, getTeamByCodigo } from '@/lib/actions/teams'
import { AcceptInvitationButton } from '@/components/onboarding/AcceptInvitationButton'
import { JoinByCodeButton } from '@/components/onboarding/JoinByCodeButton'
import { Stethoscope, CheckCircle, XCircle } from 'lucide-react'

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

// Short team codes look like "ABC-123" (7 chars with dash) or "ABCDEF" (6 chars).
// UUIDs are 36 chars. Anything ≤ 8 chars is treated as a join code.
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

    return (
      <PageShell>
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Únete al equipo</h2>
          <p className="text-gray-500 text-sm mb-6">
            Te han invitado a unirte a{' '}
            <strong className="text-gray-900">{team.nombre}</strong>
            {team.hospital ? ` · ${team.hospital}` : ''}.
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

  const team = (invitation as any).team

  return (
    <PageShell>
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Invitación al equipo</h2>
        <p className="text-gray-500 text-sm mb-6">
          Has sido invitado a unirte a{' '}
          <strong className="text-gray-900">{team?.nombre}</strong>
          {team?.hospital ? ` · ${team.hospital}` : ''}.
        </p>
        <AcceptInvitationButton token={token} />
      </div>
    </PageShell>
  )
}
