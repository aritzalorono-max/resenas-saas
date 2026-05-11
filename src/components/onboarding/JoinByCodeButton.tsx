'use client'

import { useState } from 'react'
import { joinTeamByCode } from '@/lib/actions/teams'
import Link from 'next/link'

export function JoinByCodeButton({ codigo }: { codigo: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [needsLogin, setNeedsLogin] = useState(false)

  async function handleJoin() {
    setLoading(true)
    setError('')
    const result = await joinTeamByCode(codigo)
    if (result.error) {
      if (result.error.includes('autenticado')) {
        setNeedsLogin(true)
      } else {
        setError(result.error)
      }
      setLoading(false)
      return
    }
    window.location.href = '/dashboard'
  }

  if (needsLogin) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Debes iniciar sesión (o crear una cuenta) para unirte al equipo.
        </p>
        <Link href={`/login?next=/unirse/${codigo}`} className="btn-primary w-full justify-center">
          Iniciar sesión
        </Link>
        <Link href={`/registro?next=/unirse/${codigo}`} className="block text-center text-sm text-blue-600 hover:underline">
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
      <button onClick={handleJoin} disabled={loading} className="btn-primary w-full justify-center">
        {loading ? 'Uniéndose…' : 'Unirse al equipo'}
      </button>
    </>
  )
}
