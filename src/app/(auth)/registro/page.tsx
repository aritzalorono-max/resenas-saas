'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/actions/auth'
import { Stethoscope } from 'lucide-react'

function RegistroForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const inviteToken  = searchParams.get('invite') ?? undefined

  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      setLoading(false)
      return
    }

    const result = await signUp(email, password, fullName, inviteToken)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.hasTeam) {
      router.push('/dashboard')
    } else {
      router.push('/onboarding')
    }
    router.refresh()
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Crear cuenta</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nombre completo</label>
              <input type="text" required className="input" value={fullName}
                onChange={e => setFullName(e.target.value)} placeholder="Dra. María García" />
            </div>

            <div>
              <label className="label">Correo electrónico</label>
              <input type="email" required className="input" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="tu@hospital.eus" />
            </div>

            <div>
              <label className="label">Contraseña</label>
              <input type="password" required className="input" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
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
