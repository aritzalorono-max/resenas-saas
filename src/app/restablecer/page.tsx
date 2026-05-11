'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/lib/actions/auth'
import { Stethoscope, KeyRound } from 'lucide-react'

export default function RestablecerPage() {
  const router = useRouter()
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true)
    const result = await updatePassword(password)
    if (result.error) { setError(result.error); setLoading(false); return }
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Guardias</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
                <KeyRound className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Contraseña actualizada</h2>
              <p className="text-gray-500 text-sm">Redirigiendo al inicio…</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Nueva contraseña</h2>
              <p className="text-sm text-gray-500 mb-6">Elige una contraseña segura para tu cuenta.</p>

              {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Nueva contraseña</label>
                  <input type="password" required className="input" value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password" autoFocus />
                </div>
                <div>
                  <label className="label">Confirmar contraseña</label>
                  <input type="password" required className="input" value={confirm}
                    onChange={e => setConfirm(e.target.value)} placeholder="Repite la contraseña"
                    autoComplete="new-password" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
                  {loading ? 'Guardando…' : 'Guardar contraseña'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
