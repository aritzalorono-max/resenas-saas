// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { type TeamRole, type Team, type TeamMember, type TeamInvitation } from '@/types'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const pick = () => chars[Math.floor(Math.random() * chars.length)]
  return `${pick()}${pick()}${pick()}-${pick()}${pick()}${pick()}`
}

// ─── Current team context ─────────────────────────────────────────────────────

export async function getTeamContext(profileId: string, teamId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guardias_team_members')
    .select('role, status, team:guardias_teams(*)')
    .eq('profile_id', profileId)
    .eq('team_id', teamId)
    .eq('status', 'active')
    .single()
  if (!data) return null
  return { role: data.role as TeamRole, team: data.team as Team }
}

export async function listUserTeams(profileId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guardias_team_members')
    .select('role, status, team:guardias_teams(*)')
    .eq('profile_id', profileId)
    .eq('status', 'active')
    .order('joined_at')
  return (data ?? []).map(d => ({ role: d.role as TeamRole, team: d.team as Team }))
}

// Returns all teams the current user belongs to (active membership)
export async function getMyTeams(): Promise<Team[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase
    .from('guardias_team_members')
    .select('team:guardias_teams(*)')
    .eq('profile_id', user.id)
    .eq('status', 'active')
  return (data ?? []).map(d => d.team as Team).filter(Boolean)
}

// Returns the current user's role in their active team
export async function getMyTeamRole(teamId?: string): Promise<TeamRole | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  let resolvedTeamId = teamId
  if (!resolvedTeamId) {
    const { data: profileData } = await supabase.rpc('get_my_profile')
    resolvedTeamId = (profileData as any)?.active_team_id
  }
  if (!resolvedTeamId) return null

  const { data } = await supabase.rpc('get_my_team_role', { p_team_id: resolvedTeamId })
  return (data as TeamRole) ?? null
}

// ─── Create team ──────────────────────────────────────────────────────────────

export async function createTeam(data: {
  nombre: string
  descripcion?: string
  hospital?: string
  especialidad?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  let code = generateCode()
  let attempts = 0

  while (attempts < 5) {
    const { data: existing } = await supabase
      .from('guardias_teams')
      .select('id')
      .eq('codigo', code)
      .single()
    if (!existing) break
    code = generateCode()
    attempts++
  }

  const { data: team, error: teamError } = await supabase
    .from('guardias_teams')
    .insert({
      nombre:      data.nombre,
      descripcion: data.descripcion ?? null,
      hospital:    data.hospital ?? null,
      especialidad: data.especialidad ?? null,
      codigo:      code,
      created_by:  user.id,
    })
    .select()
    .single()

  if (teamError) return { error: teamError.message }

  // Add creator as gestor
  const { error: memberError } = await supabase
    .from('guardias_team_members')
    .insert({ team_id: team.id, profile_id: user.id, role: 'gestor', status: 'active' })
  if (memberError) return { error: memberError.message }

  // Set active team
  await supabase
    .from('guardias_profiles')
    .update({ active_team_id: team.id })
    .eq('id', user.id)

  // Seed penosidad config for new team
  await supabase.from('guardias_penosidad_config').insert([
    { team_id: team.id, tipo_dia: 'festivo_especial', nivel: 1, etiqueta: 'Festivo Especial',  descripcion: 'Navidad, Año Nuevo, Reyes.', color: '#dc2626', puntos_base: 3.00 },
    { team_id: team.id, tipo_dia: 'domingo',          nivel: 2, etiqueta: 'Domingo',            descripcion: 'Domingos no festivos.',      color: '#ea580c', puntos_base: 2.50 },
    { team_id: team.id, tipo_dia: 'festivo',          nivel: 3, etiqueta: 'Festivo',            descripcion: 'Festivos nacionales.',       color: '#d97706', puntos_base: 2.00 },
    { team_id: team.id, tipo_dia: 'puente',           nivel: 4, etiqueta: 'Puente',             descripcion: 'Días de puente.',            color: '#ca8a04', puntos_base: 1.75 },
    { team_id: team.id, tipo_dia: 'sabado',           nivel: 5, etiqueta: 'Sábado',             descripcion: 'Sábados no festivos.',       color: '#65a30d', puntos_base: 1.50 },
    { team_id: team.id, tipo_dia: 'vispera',          nivel: 6, etiqueta: 'Víspera',            descripcion: 'Día anterior a festivo.',    color: '#16a34a', puntos_base: 1.25 },
    { team_id: team.id, tipo_dia: 'laborable',        nivel: 7, etiqueta: 'Laborable',          descripcion: 'Día laborable ordinario.',   color: '#2563eb', puntos_base: 1.00 },
  ])

  // Seed rules config
  await supabase.from('guardias_rules_config').insert({
    team_id: team.id, descanso_minimo_horas: 12, descanso_activo: true,
    max_guardias_mes: 8, max_guardias_mes_activo: true,
  })

  return { success: true, team }
}

// ─── Join by code ─────────────────────────────────────────────────────────────

export async function joinTeamByCode(code: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: team } = await supabase
    .from('guardias_teams')
    .select('*')
    .eq('codigo', code.toUpperCase())
    .single()

  if (!team) return { error: 'Código no válido. Comprueba que esté bien escrito.' }

  // Check if already a member
  const { data: existing } = await supabase
    .from('guardias_team_members')
    .select('id, status')
    .eq('team_id', team.id)
    .eq('profile_id', user.id)
    .single()

  if (existing?.status === 'active') {
    // Already active: just switch to this team
    await supabase.from('guardias_profiles').update({ active_team_id: team.id }).eq('id', user.id)
    return { success: true, team }
  }

  if (existing?.status === 'pending') {
    return { error: 'Tu solicitud ya está pendiente de aprobación.' }
  }

  // Add as member
  const { error } = await supabase
    .from('guardias_team_members')
    .insert({ team_id: team.id, profile_id: user.id, role: 'medico', status: 'active' })
  if (error) return { error: error.message }

  // Set active team
  await supabase.from('guardias_profiles').update({ active_team_id: team.id }).eq('id', user.id)

  return { success: true, team }
}

// ─── Switch active team ───────────────────────────────────────────────────────

export async function switchTeam(teamId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('guardias_profiles')
    .update({ active_team_id: teamId })
    .eq('id', user.id)
  if (error) return { error: error.message }
  return { success: true }
}

// ─── Team members ─────────────────────────────────────────────────────────────

export async function listTeamMembers(teamId: string): Promise<TeamMember[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('list_team_members_with_profile', { p_team_id: teamId })
  if (!data) return []
  return (data as any[]).map(row => ({
    id:         row.id,
    team_id:    row.team_id,
    profile_id: row.profile_id,
    role:       row.role,
    status:     row.status,
    joined_at:  row.joined_at,
    profile: { id: row.profile_id, full_name: row.full_name, avatar_url: row.avatar_url },
  })) as TeamMember[]
}

export async function updateMemberRole(memberId: string, role: TeamRole) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('guardias_team_members')
    .update({ role })
    .eq('id', memberId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function removeMember(teamId: string, profileId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('guardias_team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('profile_id', profileId)
  if (error) return { error: error.message }
  return { success: true }
}

// ─── Invitations ──────────────────────────────────────────────────────────────

export async function listInvitations(teamId: string): Promise<TeamInvitation[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guardias_team_invitations')
    .select('*')
    .eq('team_id', teamId)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
  return (data ?? []) as TeamInvitation[]
}

export async function createInvitation(teamId: string, email: string, role: TeamRole = 'medico') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  // Check for existing pending invite
  const { data: existing } = await supabase
    .from('guardias_team_invitations')
    .select('id')
    .eq('team_id', teamId)
    .eq('email', email.toLowerCase())
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (existing) return { error: 'Ya hay una invitación pendiente para ese email.' }

  const { data: inv, error } = await supabase
    .from('guardias_team_invitations')
    .insert({
      team_id:    teamId,
      email:      email.toLowerCase(),
      role,
      invited_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Check if user is already registered
  const { data: existingProfile } = await supabase
    .from('guardias_profiles')
    .select('id')
    .eq('id', (await supabase.auth.admin?.listUsers?.())?.data?.users?.find(u => u.email === email.toLowerCase())?.id ?? '')
    .single()

  // Try to send email (if RESEND_API_KEY is configured)
  await sendInvitationEmail(email, inv.token, teamId)

  return { success: true, token: inv.token, invitation: inv }
}

export async function revokeInvitation(invitationId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('guardias_team_invitations')
    .delete()
    .eq('id', invitationId)
  if (error) return { error: error.message }
  return { success: true }
}

// ─── Get team by short join code (for shareable links) ───────────────────────

export async function getTeamByCodigo(codigo: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guardias_teams')
    .select('id, nombre, hospital, especialidad')
    .eq('codigo', codigo.toUpperCase())
    .single()
  return data ?? null
}

// ─── Accept invitation (by token) ────────────────────────────────────────────

export async function getInvitationByToken(token: string) {
  const supabase = await createClient()
  // Use SECURITY DEFINER RPC so anon users can also read valid invitations
  const { data } = await supabase.rpc('get_invitation_by_token', { p_token: token })
  if (!data || (Array.isArray(data) && data.length === 0)) return null
  const row = Array.isArray(data) ? data[0] : data
  return {
    id:       row.id,
    team_id:  row.team_id,
    email:    row.email,
    role:     row.role,
    expires_at: row.expires_at,
    team: { nombre: row.team_nombre, hospital: row.team_hospital },
  }
}

export async function acceptInvitation(token: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión primero.' }

  const inv = await getInvitationByToken(token)
  if (!inv) return { error: 'Invitación no válida o caducada.' }

  // Add as team member
  const { error: memberError } = await supabase
    .from('guardias_team_members')
    .insert({ team_id: inv.team_id, profile_id: user.id, role: inv.role, status: 'active' })
    .select()
    .single()

  if (memberError && !memberError.message.includes('duplicate')) {
    return { error: memberError.message }
  }

  // Mark invitation as used
  await supabase
    .from('guardias_team_invitations')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)

  // Set active team
  await supabase
    .from('guardias_profiles')
    .update({ active_team_id: inv.team_id })
    .eq('id', user.id)

  return { success: true, teamId: inv.team_id }
}

// ─── Update team settings ─────────────────────────────────────────────────────

export async function updateTeam(teamId: string, data: {
  nombre?: string
  descripcion?: string
  hospital?: string
  especialidad?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('guardias_teams')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', teamId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function regenerateTeamCode(teamId: string) {
  const supabase = await createClient()
  const newCode = generateCode()
  const { error } = await supabase
    .from('guardias_teams')
    .update({ codigo: newCode })
    .eq('id', teamId)
  if (error) return { error: error.message }
  return { success: true, codigo: newCode }
}

// ─── Email helper (optional – requires RESEND_API_KEY) ────────────────────────

async function sendInvitationEmail(email: string, token: string, teamId: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // silently skip if not configured

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const link   = `${appUrl}/unirse/${token}`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:    'Guardias <no-reply@resend.dev>',
        to:      [email],
        subject: 'Te han invitado a un equipo de Guardias',
        html:    `<p>Has sido invitado a un equipo en GuardiaGuardia.</p>
                  <p><a href="${link}">Aceptar invitación</a></p>
                  <p>El enlace caduca en 7 días.</p>`,
      }),
    })
  } catch (e) {
    // Non-critical: don't fail the action if email fails
  }
}
