'use client'

import { useState } from 'react'
import { updateProfileName, updatePassword, deleteAccount, signOut } from '@/lib/actions/auth'
import { updateDoctorProfile } from '@/lib/actions/doctors'
import { type DoctorProfile, type DoctorCategoria, CATEGORIA_LABELS } from '@/types'
import { User, Lock, Trash2, LogOut, Stethoscope } from 'lucide-react'

const CATEGORIAS: DoctorCategoria[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'Adjunto']

interface Props {
  fullName: string
  email: string
  doctorProfile: DoctorProfile | null
}

export function CuentaClient({ fullName: initialName, email, doctorProfile }: Props) {
  const [name, setName]               = useState(initialName)
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMsg, setNameMsg]         = useState('')

  const [newPwd, setNewPwd]         = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg]         = useState('')

  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError]     = useState('')

  // Doctor profile fields
  const [categoria, setCategoria]           = useState<DoctorCategoria>(doctorProfile?.categoria ?? 'Adjunto')
  const [jornadaCompleta, setJornadaCompleta] = useState(doctorProfile?.jornada_completa ?? true)
  const [reduccion, setReduccion]           = useState<string>(
    doctorProfile?.reduccion_porcentaje != null ? String(doctorProfile.reduccion_porcentaje) : ''
  )
  const [docLoading, setDocLoading] = useState(false)
  const [docMsg, setDocMsg]         = useState('')

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setNameLoading(true)
    setNameMsg('')
    const result = await updateProfileName(name)
    setNameMsg(result.error ? `Error: ${result.error}` : 'Nombre actualizado.')
    setNameLoading(false)
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    setPwdMsg('')
    if (newPwd !== confirmPwd) { setPwdMsg('Las contraseñas no coinciden.'); return }
    if (newPwd.length < 8) { setPwdMsg('La contraseña debe tener al menos 8 caracteres.'); return }
    setPwdLoading(true)
    const result = await updatePassword(newPwd)
    if (result.error) {
      setPwdMsg(`Error: ${result.error}`)
    } else {
      setPwdMsg('Contraseña actualizada correctamente.')
      setNewPwd(''); setConfirmPwd('')
    }
    setPwdLoading(false)
  }

  async function handleDocSave(e: React.FormEvent) {
    e.preventDefault()
    if (!doctorProfile) return
    setDocLoading(true)
    setDocMsg('')
    const reduccionNum = !jornadaCompleta && reduccion !== '' ? parseFloat(reduccion) : null
    const result = await updateDoctorProfile(doctorProfile.id, {
      categoria,
      jornadaCompleta,
      reduccionPorcentaje: reduccionNum,
    })
    setDocMsg(result.error ? `Error: ${result.error}` : 'Perfil médico actualizado.')
    setDocLoading(false)
  }

  async function handleSignOut() {
    await signOut()
    window.location.href = '/login'
  }

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault()
    if (deleteConfirm !== email) { setDeleteError('El email no coincide.'); return }
    setDeleteLoading(true)
    const result = await deleteAccount()
    if (result.error) {
      setDeleteError(result.error)
      setDeleteLoading(false)
      return
    }
    window.location.href = '/login'
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
        <p className="text-gray-500 text-sm mt-0.5">{email}</p>
      </div>

      {/* Nombre */}
      <section className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={16} className="text-gray-400" />
          <h2 className="font-semibold text-gray-900">Nombre</h2>
        </div>
        <form onSubmit={handleNameSave} className="space-y-3">
          <input
            type="text" required className="input" value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tu nombre completo"
          />
          {nameMsg && (
            <p className={`text-sm ${nameMsg.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{nameMsg}</p>
          )}
          <button type="submit" disabled={nameLoading} className="btn-primary">
            {nameLoading ? 'Guardando…' : 'Guardar nombre'}
          </button>
        </form>
      </section>

      {/* Perfil médico */}
      {doctorProfile && (
        <section className="card space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope size={16} className="text-gray-400" />
            <h2 className="font-semibold text-gray-900">Perfil médico</h2>
          </div>
          <form onSubmit={handleDocSave} className="space-y-4">
            <div>
              <label className="label">Categoría</label>
              <select
                className="input"
                value={categoria}
                onChange={e => setCategoria(e.target.value as DoctorCategoria)}
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{CATEGORIA_LABELS[c]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Jornada</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="jornada" value="completa"
                    checked={jornadaCompleta}
                    onChange={() => { setJornadaCompleta(true); setReduccion('') }}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Jornada completa</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="jornada" value="reduccion"
                    checked={!jornadaCompleta}
                    onChange={() => setJornadaCompleta(false)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Reducción de jornada</span>
                </label>
              </div>

              {!jornadaCompleta && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number" min="1" max="99" step="1"
                    required={!jornadaCompleta}
                    className="input w-28"
                    value={reduccion}
                    onChange={e => setReduccion(e.target.value)}
                    placeholder="50"
                  />
                  <span className="text-sm text-gray-500">% de reducción</span>
                </div>
              )}
            </div>

            {docMsg && (
              <p className={`text-sm ${docMsg.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{docMsg}</p>
            )}
            <button type="submit" disabled={docLoading} className="btn-primary">
              {docLoading ? 'Guardando…' : 'Guardar perfil médico'}
            </button>
          </form>
        </section>
      )}

      {/* Contraseña */}
      <section className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={16} className="text-gray-400" />
          <h2 className="font-semibold text-gray-900">Cambiar contraseña</h2>
        </div>
        <form onSubmit={handlePasswordSave} className="space-y-3">
          <div>
            <label className="label">Nueva contraseña</label>
            <input
              type="password" required className="input" value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div>
            <label className="label">Confirmar contraseña</label>
            <input
              type="password" required className="input" value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              placeholder="Repite la contraseña"
            />
          </div>
          {pwdMsg && (
            <p className={`text-sm ${pwdMsg.startsWith('Error') || pwdMsg.includes('no coinciden') || pwdMsg.includes('al menos') ? 'text-red-600' : 'text-green-600'}`}>{pwdMsg}</p>
          )}
          <button type="submit" disabled={pwdLoading} className="btn-primary">
            {pwdLoading ? 'Actualizando…' : 'Cambiar contraseña'}
          </button>
        </form>
      </section>

      {/* Cerrar sesión */}
      <section className="card">
        <div className="flex items-center gap-2 mb-3">
          <LogOut size={16} className="text-gray-400" />
          <h2 className="font-semibold text-gray-900">Sesión</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">Cerrar sesión en este dispositivo.</p>
        <button onClick={handleSignOut} className="btn-secondary">
          Cerrar sesión
        </button>
      </section>

      {/* Eliminar cuenta */}
      <section className="card border-red-100 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={16} className="text-red-400" />
          <h2 className="font-semibold text-red-700">Eliminar cuenta</h2>
        </div>
        <p className="text-sm text-gray-500">
          Esta acción es <strong>irreversible</strong>. Se eliminarán todos tus datos. Para confirmar, escribe tu email.
        </p>
        <form onSubmit={handleDelete} className="space-y-3">
          <input
            type="email" required className="input border-red-200 focus:ring-red-500" value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
            placeholder={email}
          />
          {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
          <button
            type="submit" disabled={deleteLoading || deleteConfirm !== email}
            className="btn-primary bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {deleteLoading ? 'Eliminando…' : 'Eliminar cuenta permanentemente'}
          </button>
        </form>
      </section>
    </div>
  )
}
