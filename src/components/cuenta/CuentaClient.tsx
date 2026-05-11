'use client'

import { useState } from 'react'
import { updateProfile, updatePassword, deleteAccount } from '@/lib/actions/auth'
import { type Profile } from '@/types'
import { Save, KeyRound, LogOut, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { signOut } from '@/lib/actions/auth'

interface Props {
  profile: Profile | null
  email: string
}

function SuccessMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
      <CheckCircle size={15} className="shrink-0" />
      {msg}
    </div>
  )
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{msg}</div>
  )
}

export function CuentaClient({ profile, email }: Props) {
  // ── Datos del servicio ────────────────────────────────────────────────────
  const [fullName,       setFullName]       = useState(profile?.full_name       ?? '')
  const [hospital,       setHospital]       = useState(profile?.hospital        ?? '')
  const [especialidad,   setEspecialidad]   = useState(profile?.especialidad    ?? '')
  const [nombreServicio, setNombreServicio] = useState(profile?.nombre_servicio ?? '')
  const [profileMsg,     setProfileMsg]     = useState<{ ok?: string; err?: string }>({})
  const [profileLoading, setProfileLoading] = useState(false)

  // ── Cambiar contraseña ────────────────────────────────────────────────────
  const [newPass,      setNewPass]      = useState('')
  const [confirmPass,  setConfirmPass]  = useState('')
  const [passMsg,      setPassMsg]      = useState<{ ok?: string; err?: string }>({})
  const [passLoading,  setPassLoading]  = useState(false)

  // ── Eliminar cuenta ───────────────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading,     setDeleteLoading]     = useState(false)
  const [deleteErr,         setDeleteErr]         = useState('')

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileMsg({})
    setProfileLoading(true)
    const result = await updateProfile({
      fullName:       fullName.trim(),
      hospital:       hospital.trim(),
      especialidad:   especialidad.trim(),
      nombreServicio: nombreServicio.trim(),
    })
    if (result.error) setProfileMsg({ err: result.error })
    else              setProfileMsg({ ok: 'Datos guardados correctamente.' })
    setProfileLoading(false)
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    setPassMsg({})
    if (newPass.length < 6)    { setPassMsg({ err: 'La contraseña debe tener al menos 6 caracteres.' }); return }
    if (newPass !== confirmPass){ setPassMsg({ err: 'Las contraseñas no coinciden.' }); return }
    setPassLoading(true)
    const result = await updatePassword(newPass)
    if (result.error) setPassMsg({ err: result.error })
    else { setPassMsg({ ok: 'Contraseña actualizada correctamente.' }); setNewPass(''); setConfirmPass('') }
    setPassLoading(false)
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    setDeleteErr('')
    const result = await deleteAccount()
    if (result.error) { setDeleteErr(result.error); setDeleteLoading(false); return }
    window.location.href = '/login'
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
        <p className="text-gray-500 mt-1 text-sm">{email}</p>
      </div>

      {/* ── Datos del servicio ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Datos del servicio</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          {profileMsg.ok  && <SuccessMsg msg={profileMsg.ok} />}
          {profileMsg.err && <ErrorMsg msg={profileMsg.err} />}

          <div>
            <label className="label">Tu nombre</label>
            <input type="text" className="input" value={fullName}
              onChange={e => setFullName(e.target.value)} placeholder="Dr. García López" />
          </div>
          <div>
            <label className="label">Hospital</label>
            <input type="text" className="input" value={hospital}
              onChange={e => setHospital(e.target.value)} placeholder="Hospital Universitario de Galdakao" />
          </div>
          <div>
            <label className="label">Especialidad</label>
            <input type="text" className="input" value={especialidad}
              onChange={e => setEspecialidad(e.target.value)} placeholder="Urología" />
          </div>
          <div>
            <label className="label">Nombre del servicio</label>
            <input type="text" className="input" value={nombreServicio}
              onChange={e => setNombreServicio(e.target.value)} placeholder="Servicio de Urología" />
          </div>

          <button type="submit" disabled={profileLoading} className="btn-primary">
            <Save size={15} />
            {profileLoading ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </form>
      </section>

      {/* ── Cambiar contraseña ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Cambiar contraseña</h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          {passMsg.ok  && <SuccessMsg msg={passMsg.ok} />}
          {passMsg.err && <ErrorMsg msg={passMsg.err} />}

          <div>
            <label className="label">Nueva contraseña</label>
            <input type="password" className="input" value={newPass}
              onChange={e => setNewPass(e.target.value)} placeholder="Mínimo 6 caracteres"
              autoComplete="new-password" />
          </div>
          <div>
            <label className="label">Confirmar contraseña</label>
            <input type="password" className="input" value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)} placeholder="Repite la contraseña"
              autoComplete="new-password" />
          </div>

          <button type="submit" disabled={passLoading} className="btn-primary">
            <KeyRound size={15} />
            {passLoading ? 'Guardando…' : 'Actualizar contraseña'}
          </button>
        </form>
      </section>

      {/* ── Sesión y cuenta ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Sesión y cuenta</h2>
        <div className="space-y-3">
          <form action={signOut}>
            <button type="submit" className="btn-secondary w-full justify-center">
              <LogOut size={15} />
              Cerrar sesión
            </button>
          </form>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={15} />
              Eliminar cuenta
            </button>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  Esta acción es <strong>irreversible</strong>. Se borrarán todos tus datos permanentemente.
                </p>
              </div>
              {deleteErr && <ErrorMsg msg={deleteErr} />}
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteErr('') }}
                  className="btn-secondary flex-1 justify-center text-xs py-1.5"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  <Trash2 size={13} />
                  {deleteLoading ? 'Eliminando…' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
