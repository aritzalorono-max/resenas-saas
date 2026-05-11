'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { switchTeam } from '@/lib/actions/teams'
import { type UserRole, type Team } from '@/types'
import {
  LayoutDashboard, Users, CalendarDays, Star, Settings,
  LogOut, ChevronRight, Stethoscope, ClipboardList, Building2, ChevronDown,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  roles: UserRole[]
}

const NAV: NavItem[] = [
  { href: '/dashboard',  label: 'Inicio',     icon: <LayoutDashboard size={18} />, roles: ['admin','gestor','medico'] },
  { href: '/medicos',    label: 'Médicos',    icon: <Users size={18} />,           roles: ['admin','gestor','medico'] },
  { href: '/calendario', label: 'Calendario', icon: <CalendarDays size={18} />,    roles: ['admin','gestor','medico'] },
  { href: '/cuadrante',  label: 'Cuadrante',  icon: <ClipboardList size={18} />,   roles: ['admin','gestor','medico'] },
  { href: '/festivos',   label: 'Festivos',   icon: <Star size={18} />,            roles: ['admin','gestor'] },
  { href: '/penosidad',  label: 'Penosidad',  icon: <Settings size={18} />,        roles: ['admin','gestor'] },
  { href: '/equipo',     label: 'Mi Equipo',  icon: <Building2 size={18} />,       roles: ['admin','gestor','medico'] },
]

interface Props {
  role: UserRole
  fullName: string
  teamName: string | null
  teams: Team[]
  activeTeamId: string | null
}

export function Sidebar({ role, fullName, teamName, teams, activeTeamId }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const [showTeamPicker, setShowTeamPicker] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  async function handleSwitchTeam(teamId: string) {
    await switchTeam(teamId)
    setShowTeamPicker(false)
    router.refresh()
  }

  const items = NAV.filter(n => n.roles.includes(role))

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 min-h-screen">
      {/* Team header */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Stethoscope size={16} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-semibold text-sm leading-tight truncate">
              {teamName ?? 'Sin equipo'}
            </p>
            <p className="text-slate-400 text-xs">Guardias</p>
          </div>
          {teams.length > 1 && (
            <button
              onClick={() => setShowTeamPicker(v => !v)}
              className="text-slate-400 hover:text-white transition-colors shrink-0"
              title="Cambiar equipo"
            >
              <ChevronDown size={14} />
            </button>
          )}
        </div>

        {showTeamPicker && teams.length > 1 && (
          <div className="mt-2 rounded-lg bg-slate-800 overflow-hidden">
            {teams.map(t => (
              <button
                key={t.id}
                onClick={() => handleSwitchTeam(t.id)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  t.id === activeTeamId
                    ? 'text-blue-400 bg-slate-700'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {t.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} className="text-blue-300" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-slate-800 pt-4">
        <div className="px-3 py-2 mb-2">
          <p className="text-white text-sm font-medium truncate">{fullName}</p>
          <p className="text-slate-400 text-xs capitalize">{
            role === 'admin' ? 'Administrador' : role === 'gestor' ? 'Médico · Gestor' : 'Médico'
          }</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
