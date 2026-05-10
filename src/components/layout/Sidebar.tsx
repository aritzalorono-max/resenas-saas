'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { type UserRole } from '@/types'
import {
  LayoutDashboard, Users, CalendarDays, Star, Settings,
  LogOut, ChevronRight, Stethoscope, ClipboardList,
} from 'lucide-react'

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
]

interface Props {
  role: UserRole
  fullName: string
}

export function Sidebar({ role, fullName }: Props) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const items = NAV.filter(n => n.roles.includes(role))

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 min-h-screen">
      {/* Marca */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Stethoscope size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">Guardias</p>
            <p className="text-slate-400 text-xs truncate">Urología · Galdakao</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
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

      {/* Usuario */}
      <div className="px-3 pb-4 border-t border-slate-800 pt-4">
        <div className="px-3 py-2 mb-2">
          <p className="text-white text-sm font-medium truncate">{fullName}</p>
          <p className="text-slate-400 text-xs capitalize">{
            role === 'admin' ? 'Administrador' : role === 'gestor' ? 'Gestor' : 'Médico'
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
