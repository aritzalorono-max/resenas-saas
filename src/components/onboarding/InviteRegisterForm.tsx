'use client'

import { useState } from 'react'
import { signUp } from '@/lib/actions/auth'
import { acceptInvitation } from '@/lib/actions/teams'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

interface Props {
  token: string
  email: string
  teamNombre: string
  teamHospital?: string | null
  isLoggedIn: boolean
  loggedInEmail?: string
}

export function InviteRegisterForm({ token, email, teamNombre, teamHospital, isLoggedIn, loggedInEmail }: Props) {
  const [name, setName]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // Already logged in as a different user → just accept
  async function handleAccept() {
    setLoading(true)
    setError('')
    const result = await acceptInvitation(token)
    if (result.error) { setError(result.error); setLoading(false); return }
    window.location.href = '/dashboard'
  }

  // Not logged in → register + auto-join
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signUp(email, password, name, token)
    if (result.error) { setError(result.error); setLoading(false); return }
    window.location.href = '/dashboard'
  }

  if (isLoggedIn) {
    const sameEmail = loggedInEmail?.toLowerCase() === email.toLowerCase()
    return (
      <div className="space-y-4">
        {sameEmail ? (
          <p className="text-sm text-gray-500">
            Estás conectado como <strong>{loggedInEmail}</strong>. Pulsa para unirte al equipo.
          </p>
        ) : (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            Esta invitación es para <strong>{email}</strong>. Estás conectado como <strong>{loggedInEmail}</strong>.
            Si quieres aceptarla con tu cuenta actual, pulsa el botón. O{' '}
            <Link href="/login" className="underline">cierra sesión</Link> y crea una nueva cuenta.
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button onClick={handleAccept} disabled={loading} className="btn-primary w-full justify-center">
          {loading ? 'Uniéndose…' : 'Unirse al equipo'}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <p className="text-sm text-gray-500">
        Crea tu cuenta para unirte. Solo necesitas tu nombre y una contraseña.
      </p>

      <div>
        <label className="label">Email</label>
        <input type="email" readOnly value={email}
          className="input bg-gray-50 text-gray-500 cursor-not-allowed" />
      </div>

      <div>
        <label className="label">Tu nombre completo <span className="text-red-500">*</span></label>
        <input type="text" required className="input" value={name}
          onChange={e => setName(e.target.value)} placeholder="Nombre Apellidos" autoFocus />
      </div>

      <div>
        <label className="label">Contraseña <span className="text-red-500">*</span></label>
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'} required className="input pr-10"
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres" minLength={8}
          />
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
        {loading ? 'Creando cuenta…' : 'Crear cuenta y unirse'}
      </button>

      <p className="text-center text-xs text-gray-400">
        ¿Ya tienes cuenta?{' '}
        <Link href={`/login?invite=${token}`} className="text-blue-600 hover:underline">Inicia sesión</Link>
      </p>
    </form>
  )
}
