'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/actions/auth'
import { Stethoscope, Mail } from 'lucide-react'

function RegistroForm() {
  const searchParams = useSearchParams()
  const inviteToken  = searchParams.get('invite') ?? undefined

  const [email, setEmail]         = useState('')
  const [emailConf, setEmailConf] = useState('')
  const [password, setPassword]   = useState('')
  const [teamCode, setTeamCode]   = useState('')
  const [terms, setTerms]         = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (email !== emailConf) {
      setError('Los correos electrónicos no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (!terms) {
      setError('Debes aceptar los términos y la política de privacidad.')
      return
    }

    setLoading(true)
    const defaultName = email.split('@')[0]
    const normalizedCode = teamCode.trim().toUpperCase().replace(/\s+/g, '') || undefined
    const result = await signUp(email, password, defaultName, inviteToken, normalizedCode)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setDone(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Guardias</h1>
          <p className="text-blue-200 mt-1 text-sm">
            {inviteToken ? 'Crea tu cuenta para aceptar la invitación' : 'Gestión de turnos médicos'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Revisa tu correo</h2>
              <p className="text-gray-500 text-sm mb-1">
                Hemos enviado un enlace de confirmación a:
              </p>
              <p className="font-medium text-gray-900 text-sm mb-4">{email}</p>
              <p className="text-gray-400 text-xs">
                Haz clic en el enlace del email para activar tu cuenta. Revisa también la carpeta de spam.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Crear cuenta</h2>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Correo electrónico</label>
                  <input type="email" required className="input" value={email}
                    onChange={e => setEmail(e.target.value)} placeholder="tu@hospital.eus"
                    autoComplete="email" />
                </div>

                <div>
                  <label className="label">Confirmar correo electrónico</label>
                  <input type="email" required className="input" value={emailConf}
                    onChange={e => setEmailConf(e.target.value)} placeholder="tu@hospital.eus"
                    autoComplete="off" />
                </div>

                <div>
                  <label className="label">Contraseña</label>
                  <input type="password" required className="input" value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password" />
                </div>

                {!inviteToken && (
                  <div>
                    <label className="label">Código de equipo <span className="text-gray-400 font-normal">(opcional)</span></label>
                    <input
                      type="text" className="input font-mono tracking-widest uppercase"
                      value={teamCode}
                      onChange={e => setTeamCode(e.target.value)}
                      placeholder="ABC-123"
                      maxLength={10}
                    />
                    <p className="text-xs text-gray-400 mt-1">Si tu gestor te ha dado un código, introdúcelo aquí para unirte automáticamente.</p>
                  </div>
                )}

                <div className="flex items-start gap-3 pt-1">
                  <input
                    id="terms" type="checkbox" checked={terms}
                    onChange={e => setTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer leading-snug">
                    He leído y acepto los{' '}
                    <Link href="/legal/terminos" target="_blank" className="text-blue-600 hover:underline">
                      Términos de uso
                    </Link>
                    {' '}y la{' '}
                    <Link href="/legal/privacidad" target="_blank" className="text-blue-600 hover:underline">
                      Política de privacidad
                    </Link>
                  </label>
                </div>

                <button
                  type="submit" disabled={loading || !terms}
                  className="btn-primary w-full justify-center py-2.5 mt-2"
                >
                  {loading ? 'Creando cuenta…' : 'Crear cuenta'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href={inviteToken ? `/login?invite=${inviteToken}` : '/login'}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Iniciar sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  )
}
