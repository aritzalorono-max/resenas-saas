'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn, requestPasswordReset } from '@/lib/actions/auth'
import { Stethoscope, Mail } from 'lucide-react'

type View = 'login' | 'forgot' | 'forgot_done'

function LoginForm() {
  const searchParams = useSearchParams()
  const inviteToken  = searchParams.get('invite') ?? null

  const [view, setView]         = useState<View>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(email, password)
    if (result.error) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setLoading(false)
      return
    }
    window.location.href = inviteToken ? `/unirse/${inviteToken}` : '/dashboard'
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await requestPasswordReset(resetEmail)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    setView('forgot_done')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Guardias</h1>
          <p className="text-blue-200 mt-1 text-sm">Gestión de turnos médicos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* ── LOGIN ── */}
          {view === 'login' && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Iniciar sesión</h2>

              {inviteToken && (
                <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
                  Inicia sesión para aceptar la invitación al equipo.
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="label" htmlFor="email">Correo electrónico</label>
                  <input id="email" type="email" required autoComplete="email"
                    className="input" value={email}
                    onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="label mb-0" htmlFor="password">Contraseña</label>
                    <button type="button" onClick={() => { setError(''); setView('forgot') }}
                      className="text-xs text-blue-600 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <input id="password" type="password" required autoComplete="current-password"
                    className="input" value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
                  {loading ? 'Entrando…' : 'Entrar'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                ¿Primera vez?{' '}
                <Link href={inviteToken ? `/registro?invite=${inviteToken}` : '/registro'}
                  className="text-blue-600 hover:underline font-medium">
                  Crear cuenta
                </Link>
              </p>
            </>
          )}

          {/* ── FORGOT ── */}
          {view === 'forgot' && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Recuperar contraseña</h2>
              <p className="text-sm text-gray-500 mb-6">
                Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
              </p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="label">Correo electrónico</label>
                  <input type="email" required className="input" value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)} placeholder="tu@email.com" autoFocus />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
                  {loading ? 'Enviando…' : 'Enviar enlace'}
                </button>
              </form>

              <button onClick={() => { setError(''); setView('login') }}
                className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600">
                ← Volver al inicio de sesión
              </button>
            </>
          )}

          {/* ── FORGOT DONE ── */}
          {view === 'forgot_done' && (
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Revisa tu correo</h2>
              <p className="text-gray-500 text-sm mb-1">Hemos enviado el enlace a:</p>
              <p className="font-medium text-gray-900 text-sm mb-6">{resetEmail}</p>
              <p className="text-gray-400 text-xs mb-6">Revisa también la carpeta de spam.</p>
              <button onClick={() => setView('login')}
                className="text-sm text-blue-600 hover:underline">
                ← Volver al inicio de sesión
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
