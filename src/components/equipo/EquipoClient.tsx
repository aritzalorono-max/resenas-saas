'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  createInvitation, revokeInvitation, updateMemberRole, removeMember,
  regenerateTeamCode, updateTeam,
} from '@/lib/actions/teams'
import { type Team, type TeamMember, type TeamInvitation, type TeamRole, TEAM_ROLE_LABELS } from '@/types'
import {
  Users, Mail, Copy, Check, RefreshCw, Trash2, Shield, UserMinus,
  Link as LinkIcon, Settings, Send,
} from 'lucide-react'

interface Props {
  team: Team
  members: TeamMember[]
  invitations: TeamInvitation[]
  myRole: TeamRole
  myProfileId: string
}

type Tab = 'members' | 'invitations' | 'settings'

export function EquipoClient({ team: initialTeam, members: initialMembers, invitations: initialInvitations, myRole, myProfileId }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('members')
  const [team, setTeam] = useState(initialTeam)
  const [members, setMembers] = useState(initialMembers)
  const [invitations, setInvitations] = useState(initialInvitations)

  // Invite form
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole]   = useState<TeamRole>('medico')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState('')

  // Copy state
  const [codeCopied, setCodeCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  // Settings form
  const [settingsNombre, setSettingsNombre]           = useState(team.nombre)
  const [settingsHospital, setSettingsHospital]       = useState(team.hospital ?? '')
  const [settingsEspecialidad, setSettingsEspecialidad] = useState(team.especialidad ?? '')
  const [settingsLoading, setSettingsLoading]         = useState(false)
  const [settingsMsg, setSettingsMsg]                 = useState('')

  const isGestor = myRole === 'gestor'

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteError('')
    setInviteSuccess('')
    setInviteLoading(true)
    const result = await createInvitation(team.id, inviteEmail, inviteRole)
    if (result.error) {
      setInviteError(result.error)
    } else {
      setInviteSuccess(`Invitación enviada a ${inviteEmail}`)
      setInviteEmail('')
      router.refresh()
    }
    setInviteLoading(false)
  }

  async function handleRevokeInvitation(id: string) {
    await revokeInvitation(id)
    setInvitations(prev => prev.filter(i => i.id !== id))
  }

  async function handleRoleChange(memberId: string, role: TeamRole) {
    await updateMemberRole(memberId, role)
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role } : m))
  }

  async function handleRemoveMember(profileId: string) {
    if (!confirm('¿Seguro que quieres eliminar a este miembro?')) return
    await removeMember(team.id, profileId)
    setMembers(prev => prev.filter(m => m.profile_id !== profileId))
  }

  async function handleCopyCode() {
    await navigator.clipboard.writeText(team.codigo)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}/unirse/${team.codigo}`
    await navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  async function handleRegenerateCode() {
    if (!confirm('¿Regenerar el código? El código actual dejará de funcionar.')) return
    const result = await regenerateTeamCode(team.id)
    if (result.codigo) {
      setTeam(prev => ({ ...prev, codigo: result.codigo! }))
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault()
    setSettingsLoading(true)
    setSettingsMsg('')
    const result = await updateTeam(team.id, {
      nombre:      settingsNombre,
      hospital:    settingsHospital || undefined,
      especialidad: settingsEspecialidad || undefined,
    })
    if (result.error) {
      setSettingsMsg(`Error: ${result.error}`)
    } else {
      setTeam(prev => ({ ...prev, nombre: settingsNombre, hospital: settingsHospital || null, especialidad: settingsEspecialidad || null }))
      setSettingsMsg('Cambios guardados.')
    }
    setSettingsLoading(false)
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
      tab === t ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-900'
    }`

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{team.nombre}</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {team.hospital && <span>{team.hospital} · </span>}
          {team.especialidad && <span>{team.especialidad} · </span>}
          {members.filter(m => m.status === 'active').length} miembros
        </p>
      </div>

      {/* Código de equipo */}
      <div className="card flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Código de equipo</p>
          <p className="font-mono text-2xl font-bold text-gray-900 tracking-widest">{team.codigo}</p>
          <p className="text-xs text-gray-400 mt-1">Comparte este código para que otros se unan</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleCopyCode} className="btn-secondary gap-2 text-sm">
            {codeCopied ? <Check size={14} /> : <Copy size={14} />}
            {codeCopied ? 'Copiado' : 'Copiar código'}
          </button>
          <button onClick={handleCopyLink} className="btn-secondary gap-2 text-sm">
            {linkCopied ? <Check size={14} /> : <LinkIcon size={14} />}
            {linkCopied ? 'Copiado' : 'Copiar enlace'}
          </button>
          {isGestor && (
            <button onClick={handleRegenerateCode} className="btn-secondary gap-2 text-sm text-amber-600 hover:text-amber-700">
              <RefreshCw size={14} />
              Regenerar
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-0">
        <button className={tabClass('members')} onClick={() => setTab('members')}>
          <span className="flex items-center gap-1.5"><Users size={14} /> Miembros ({members.filter(m => m.status === 'active').length})</span>
        </button>
        {isGestor && (
          <button className={tabClass('invitations')} onClick={() => setTab('invitations')}>
            <span className="flex items-center gap-1.5"><Mail size={14} /> Invitaciones ({invitations.length})</span>
          </button>
        )}
        {isGestor && (
          <button className={tabClass('settings')} onClick={() => setTab('settings')}>
            <span className="flex items-center gap-1.5"><Settings size={14} /> Ajustes</span>
          </button>
        )}
      </div>

      {/* Members tab */}
      {tab === 'members' && (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-th">Nombre</th>
                <th className="table-th">Rol</th>
                {isGestor && <th className="table-th w-24">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.filter(m => m.status === 'active').map(m => {
                const isMe = m.profile_id === myProfileId
                return (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="table-td">
                      <p className="font-medium text-gray-900">
                        {(m.profile as any)?.full_name ?? '—'}
                        {isMe && <span className="ml-2 text-xs text-blue-600">(tú)</span>}
                      </p>
                    </td>
                    <td className="table-td">
                      {isGestor && !isMe ? (
                        <select
                          value={m.role}
                          onChange={e => handleRoleChange(m.id, e.target.value as TeamRole)}
                          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                        >
                          <option value="medico">{TEAM_ROLE_LABELS.medico}</option>
                          <option value="gestor">{TEAM_ROLE_LABELS.gestor}</option>
                        </select>
                      ) : (
                        <span className={`badge ${m.role === 'gestor' ? 'badge-blue' : 'badge-gray'}`}>
                          {TEAM_ROLE_LABELS[m.role as TeamRole]}
                        </span>
                      )}
                    </td>
                    {isGestor && (
                      <td className="table-td">
                        {!isMe && (
                          <button
                            onClick={() => handleRemoveMember(m.profile_id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Eliminar miembro"
                          >
                            <UserMinus size={15} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Invitations tab */}
      {tab === 'invitations' && isGestor && (
        <div className="space-y-4">
          <form onSubmit={handleInvite} className="card flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email" required placeholder="email@hospital.eus"
                className="input" value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
            </div>
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value as TeamRole)}
              className="input sm:w-40"
            >
              <option value="medico">Médico</option>
              <option value="gestor">Gestor</option>
            </select>
            <button type="submit" disabled={inviteLoading} className="btn-primary gap-2 shrink-0">
              <Send size={15} />
              {inviteLoading ? 'Enviando…' : 'Invitar'}
            </button>
          </form>

          {inviteError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{inviteError}</div>
          )}
          {inviteSuccess && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">{inviteSuccess}</div>
          )}

          {invitations.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No hay invitaciones pendientes.</p>
          ) : (
            <div className="card overflow-hidden p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="table-th">Email</th>
                    <th className="table-th">Rol</th>
                    <th className="table-th">Caduca</th>
                    <th className="table-th w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invitations.map(inv => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="table-td font-mono text-xs">{inv.email}</td>
                      <td className="table-td">
                        <span className="badge badge-gray">{TEAM_ROLE_LABELS[inv.role as TeamRole]}</span>
                      </td>
                      <td className="table-td text-gray-400 text-xs">
                        {new Date(inv.expires_at).toLocaleDateString('es-ES')}
                      </td>
                      <td className="table-td">
                        <button
                          onClick={() => handleRevokeInvitation(inv.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Revocar invitación"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Settings tab */}
      {tab === 'settings' && isGestor && (
        <form onSubmit={handleSaveSettings} className="card space-y-4 max-w-lg">
          <div>
            <label className="label">Nombre del equipo</label>
            <input type="text" required className="input" value={settingsNombre}
              onChange={e => setSettingsNombre(e.target.value)} />
          </div>
          <div>
            <label className="label">Hospital</label>
            <input type="text" className="input" value={settingsHospital}
              onChange={e => setSettingsHospital(e.target.value)} placeholder="Opcional" />
          </div>
          <div>
            <label className="label">Especialidad</label>
            <input type="text" className="input" value={settingsEspecialidad}
              onChange={e => setSettingsEspecialidad(e.target.value)} placeholder="Opcional" />
          </div>
          {settingsMsg && (
            <p className={`text-sm ${settingsMsg.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {settingsMsg}
            </p>
          )}
          <button type="submit" disabled={settingsLoading} className="btn-primary">
            {settingsLoading ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </form>
      )}
    </div>
  )
}
