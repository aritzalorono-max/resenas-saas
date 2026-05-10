'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { acceptInvitation } from '@/lib/actions/teams'
import Link from 'next/link'

export function AcceptInvitationButton({ token }: { token: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [needsLogin, setNeedsLogin] = useState(false)

  async function handleAccept() {
    setLoading(true)
    setError('')
    const result = await acceptInvitation(token)
    if (result.error) {
      if (result.error.includes('sesión')) {
        setNeedsLogin(true)
      } else {
        setError(result.error)
      }
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  if (needsLogin) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Debes iniciar sesión (o crear una cuenta) para aceptar la invitación.
        </p>
        <Link href={`/login?invite=${token}`} className="btn-primary w-full justify-center">
          Iniciar sesión
        </Link>
        <Link href={`/registro?invite=${token}`} className="block text-center text-sm text-blue-600 hover:underline">
          Crear cuenta nueva
        </Link>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="mb-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <button onClick={handleAccept} disabled={loading} className="btn-primary w-full justify-center">
        {loading ? 'Aceptando…' : 'Aceptar invitación'}
      </button>
    </>
  )
}
