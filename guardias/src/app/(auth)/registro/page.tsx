'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/actions/auth'
import { type UserRole } from '@/types'

export default function RegistroPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole]         = useState<UserRole>('medico')
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

    const result = await signUp(email, password, fullName, role)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Guardias Urología</h1>
          <p className="text-blue-200 mt-1 text-sm">Hospital de Galdakao · Osakidetza</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Crear cuenta</h2>
          <p className="text-sm text-gray-500 mb-6">
            El primer usuario registrado obtiene rol de <strong>Administrador</strong> automáticamente.
          </p>

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
                onChange={e => setEmail(e.target.value)} placeholder="tu@osakidetza.eus" />
            </div>

            <div>
              <label className="label">Contraseña</label>
              <input type="password" required className="input" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>

            <div>
              <label className="label">Rol solicitado</label>
              <select className="input" value={role} onChange={e => setRole(e.target.value as UserRole)}>
                <option value="medico">Médico</option>
                <option value="gestor">Gestor (Planificador)</option>
                <option value="admin">Administrador</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                El administrador podrá modificar tu rol tras el registro.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
