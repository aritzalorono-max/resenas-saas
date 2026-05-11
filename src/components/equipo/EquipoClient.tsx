'use client'

import { useState } from 'react'
import {
  createInvitation, revokeInvitation, updateMemberRole, removeMember,
  regenerateTeamCode, updateTeam,
} from '@/lib/actions/teams'
import { type Team, type TeamMember, type TeamInvitation, type TeamRole, TEAM_ROLE_LABELS } from '@/types'
import { Copy, Check, UserMinus, Link as LinkIcon, Send, Pencil, X, Plus } from 'lucide-react'

interface Props {
  team: Team
  members: TeamMember[]
  invitations: TeamInvitation[]
  myRole: TeamRole
  myProfileId: string
}

export function EquipoClient({ team: initialTeam, members: initialMembers, invitations: initialInvitations, myRole, myProfileId }: Props) {
  const [team, setTeam] = useState(initialTeam)
  const [members, setMembers] = useState(initialMembers)
  const [invitations, setInvitations] = useState(initialInvitations)

  // Inline header edit
  const [editing, setEditing] = useState(false)
  const [editNombre, setEditNombre] = useState(team.nombre)
  const [editHospital, setEditHospital] = useState(team.hospital ?? '')
  const [editEspecialidad, setEditEspecialidad] = useState(team.especialidad ?? '')
  const [editLoading, setEditLoading] = useState(false)

  // Invite form
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamRole>('medico')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false)
  const [copiedInvId, setCopiedInvId] = useState<string | null>(null)

  // Copy state
  const [codeCopied, setCodeCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const isGestor = myRole === 'gestor'
  const activeMembers = members.filter(m => m.status === 'active')

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    setEditLoading(true)
    const result = await updateTeam(team.id, {
      nombre: editNombre,
      hospital: editHospital || undefined,
      especialidad: editEspecialidad || undefined,
    })
    if (!result.error) {
      setTeam(prev => ({ ...prev, nombre: editNombre, hospital: editHospital || null, especialidad: editEspecialidad || null }))
      setEditing(false)
    }
    setEditLoading(false)
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteError('')
    setInviteLink('')
    setInviteLoading(true)
    const result = await createInvitation(team.id, inviteEmail, inviteRole)
    if (result.error) {
      setInviteError(result.error)
    } else {
      const link = `${window.location.origin}/unirse/${result.token}`
      setInviteLink(link)
      setInviteEmail('')
      setInvitations(prev => result.invitation ? [...prev, result.invitation as TeamInvitation] : prev)
    }
    setInviteLoading(false)
  }

  async function handleCopyCode() {
    await navigator.clipboard.writeText(team.codigo)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/unirse/${team.codigo}`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  async function handleRegenerateCode() {
    if (!confirm('¿Regenerar el código? El código actual dejará de funcionar.')) return
    const result = await regenerateTeamCode(team.id)
    if (result.codigo) setTeam(prev => ({ ...prev, codigo: result.codigo! }))
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

  async function handleCopyInvLink(token: string, id: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/unirse/${token}`)
    setCopiedInvId(id)
    setTimeout(() => setCopiedInvId(null), 2000)
  }

  async function handleRevokeInvitation(id: string) {
    await revokeInvitation(id)
    setInvitations(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="max-w-3xl space-y-6">

      {/* Header */}
      {editing ? (
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <input type="text" required autoFocus
            className="input text-xl font-bold w-full"
            value={editNombre} onChange={e => setEditNombre(e.target.value)} />
          <div className="flex gap-2">
            <input type="text" className="input flex-1" placeholder="Hospital"
              value={editHospital} onChange={e => setEditHospital(e.target.value)} />
            <input type="text" className="input flex-1" placeholder="Especialidad"
              value={editEspecialidad} onChange={e => setEditEspecialidad(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={editLoading} className="btn-primary text-sm py-1.5">
              {editLoading ? 'Guardando…' : 'Guardar'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-sm py-1.5">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{team.nombre}</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {[team.hospital, team.especialidad, `${activeMembers.length} miembros`].filter(Boolean).join(' · ')}
            </p>
          </div>
          {isGestor && (
            <button onClick={() => setEditing(true)}
              className="mt-1.5 text-gray-400 hover:text-gray-600 transition-colors" title="Editar equipo">
              <Pencil size={14} />
            </button>
          )}
        </div>
      )}

      {/* Código card */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Código de equipo</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-bold text-gray-900 tracking-widest">{team.codigo}</span>
              <button onClick={handleCopyCode}
                className="text-gray-400 hover:text-gray-700 transition-colors" title="Copiar código">
                {codeCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button onClick={handleCopyLink} className="btn-secondary gap-2 text-sm">
              {linkCopied ? <Check size={14} /> : <LinkIcon size={14} />}
              {linkCopied ? 'Copiado' : 'Copiar enlace'}
            </button>
            {isGestor && (
              <button onClick={handleRegenerateCode}
                className="text-xs text-gray-400 hover:text-amber-600 transition-colors">
                Regenerar código
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Comparte este código para que otros se unan al equipo</p>
      </div>

      {/* Members card */}
      <div className="card overflow-hidden p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Miembros ({activeMembers.length})</p>
          {isGestor && (
            <button
              onClick={() => { setShowInvite(v => !v); setInviteError(''); setInviteLink('') }}
              className="btn-secondary text-xs py-1.5 gap-1.5">
              <Plus size={13} />
              Invitar
            </button>
          )}
        </div>

        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-50">
            {activeMembers.map(m => {
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
                      <select value={m.role}
                        onChange={e => handleRoleChange(m.id, e.target.value as TeamRole)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white">
                        <option value="medico">{TEAM_ROLE_LABELS.medico}</option>
                        <option value="gestor">{TEAM_ROLE_LABELS.gestor}</option>
                      </select>
                    ) : (
                      <span className={`badge ${m.role === 'gestor' ? 'badge-blue' : 'badge-gray'}`}>
                        {TEAM_ROLE_LABELS[m.role as TeamRole]}
                      </span>
                    )}
                  </td>
                  <td className="table-td w-10">
                    {isGestor && !isMe && (
                      <button onClick={() => handleRemoveMember(m.profile_id)}
                        className="text-gray-400 hover:text-red-500 transition-colors" title="Eliminar miembro">
                        <UserMinus size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pending invitations */}
        {invitations.length > 0 && (
          <>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Pendientes ({invitations.length})
              </p>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                {invitations.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="table-td font-mono text-xs text-gray-500">{inv.email}</td>
                    <td className="table-td">
                      <span className="badge badge-gray">{TEAM_ROLE_LABELS[inv.role as TeamRole]}</span>
                    </td>
                    <td className="table-td w-16">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleCopyInvLink(inv.token, inv.id)}
                          className="text-gray-400 hover:text-blue-500 transition-colors" title="Copiar enlace">
                          {copiedInvId === inv.id
                            ? <Check size={14} className="text-green-500" />
                            : <LinkIcon size={14} />}
                        </button>
                        <button onClick={() => handleRevokeInvitation(inv.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors" title="Revocar">
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Invite form */}
        {showInvite && isGestor && (
          <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
            <form onSubmit={handleInvite} className="flex gap-2 flex-wrap sm:flex-nowrap">
              <input type="email" required autoFocus placeholder="email@hospital.eus"
                className="input flex-1 text-sm min-w-0"
                value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value as TeamRole)}
                className="input w-32 text-sm shrink-0">
                <option value="medico">Médico</option>
                <option value="gestor">Gestor</option>
              </select>
              <button type="submit" disabled={inviteLoading} className="btn-primary gap-2 text-sm shrink-0">
                <Send size={14} />
                {inviteLoading ? 'Enviando…' : 'Invitar'}
              </button>
            </form>

            {inviteError && <p className="text-sm text-red-600">{inviteError}</p>}

            {inviteLink && (
              <div className="space-y-1">
                <div className="flex gap-2 items-center">
                  <input readOnly value={inviteLink}
                    className="input text-xs font-mono flex-1 bg-white py-1.5" />
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(inviteLink)
                      setInviteLinkCopied(true)
                      setTimeout(() => setInviteLinkCopied(false), 2000)
                    }}
                    className="btn-secondary text-xs py-1.5 gap-1.5 shrink-0">
                    {inviteLinkCopied ? <Check size={13} /> : <Copy size={13} />}
                    Copiar
                  </button>
                </div>
                <p className="text-xs text-gray-500">Envía este enlace al médico por WhatsApp, email o como prefieras.</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
