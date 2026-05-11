'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Stethoscope, CheckCircle } from 'lucide-react'

export default function RestablecerPage() {
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [done, setDone]           = useState(false)
  const [ready, setReady]         = useState(false)

  // Supabase sends the session via URL hash fragment — wait for it
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6)  { setError('Mínimo 6 caracteres.'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
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
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {done ? (
            <div className="text-center py-2">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Contraseña actualizada</h2>
              <p className="text-gray-500 text-sm mb-6">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <a href="/login" className="btn-primary">Iniciar sesión</a>
            </div>
          ) : !ready ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Verificando enlace…</p>
              <p className="text-gray-400 text-xs mt-2">Si el enlace ha caducado, solicita uno nuevo desde el login.</p>
              <a href="/login" className="mt-4 block text-sm text-blue-600 hover:underline">
                Volver al inicio de sesión
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Nueva contraseña</h2>
              <p className="text-sm text-gray-500 mb-6">Elige una contraseña segura para tu cuenta.</p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Nueva contraseña</label>
                  <input type="password" required className="input" value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres" autoFocus />
                </div>
                <div>
                  <label className="label">Confirmar contraseña</label>
                  <input type="password" required className="input" value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repite la contraseña" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
                  {loading ? 'Guardando…' : 'Establecer nueva contraseña'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
