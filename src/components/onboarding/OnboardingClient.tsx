'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTeam, joinTeamByCode } from '@/lib/actions/teams'
import { Stethoscope, Plus, Hash } from 'lucide-react'

type Tab = 'create' | 'join'

export function OnboardingClient({ fullName }: { fullName: string }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('create')

  // Create team form
  const [nombre, setNombre]           = useState('')
  const [hospital, setHospital]       = useState('')
  const [especialidad, setEspecialidad] = useState('')

  // Join form
  const [code, setCode] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await createTeam({ nombre, hospital, especialidad })
    if (result.error) { setError(result.error); setLoading(false); return }
    window.location.href = '/dashboard'
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await joinTeamByCode(code.trim())
    if (result.error) { setError(result.error); setLoading(false); return }
    window.location.href = '/dashboard'
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Bienvenido, {fullName.split(' ')[0]}</h1>
        <p className="text-blue-200 mt-1 text-sm">Crea tu equipo o únete a uno existente</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-3.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              tab === 'create' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Plus size={16} />
            Crear equipo
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-3.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              tab === 'join' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Hash size={16} />
            Unirse con código
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {tab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-4">
              <p className="text-sm text-gray-500 -mt-1 mb-2">
                Serás el <strong>gestor</strong> del equipo y podrás invitar a tus compañeros.
              </p>
              <div>
                <label className="label">Nombre del equipo <span className="text-red-500">*</span></label>
                <input type="text" required className="input" value={nombre}
                  onChange={e => setNombre(e.target.value)} placeholder="Urología · Hospital X" />
              </div>
              <div>
                <label className="label">Hospital</label>
                <input type="text" className="input" value={hospital}
                  onChange={e => setHospital(e.target.value)} placeholder="Hospital de Galdakao" />
              </div>
              <div>
                <label className="label">Especialidad</label>
                <input type="text" className="input" value={especialidad}
                  onChange={e => setEspecialidad(e.target.value)} placeholder="Urología" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
                {loading ? 'Creando equipo…' : 'Crear equipo'}
              </button>
            </form>
          )}

          {tab === 'join' && (
            <form onSubmit={handleJoin} className="space-y-4">
              <p className="text-sm text-gray-500 -mt-1 mb-2">
                Introduce el código de 6 caracteres que te ha dado el gestor de tu equipo.
              </p>
              <div>
                <label className="label">Código de equipo <span className="text-red-500">*</span></label>
                <input
                  type="text" required className="input text-center tracking-widest uppercase font-mono text-lg"
                  value={code} onChange={e => setCode(e.target.value)}
                  placeholder="ABC-123" maxLength={7}
                />
              </div>
              <button type="submit" disabled={loading || code.trim().length < 6} className="btn-primary w-full justify-center py-2.5 mt-2">
                {loading ? 'Uniéndose…' : 'Unirse al equipo'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
