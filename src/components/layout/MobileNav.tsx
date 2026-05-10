'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type UserRole } from '@/types'
import { LayoutDashboard, Users, CalendarDays, Star, Settings, ClipboardList, Building2 } from 'lucide-react'

const NAV = [
  { href: '/dashboard',  label: 'Inicio',     icon: <LayoutDashboard size={20} />, roles: ['admin','gestor','medico'] },
  { href: '/medicos',    label: 'Médicos',    icon: <Users size={20} />,           roles: ['admin','gestor','medico'] },
  { href: '/calendario', label: 'Calendario', icon: <CalendarDays size={20} />,    roles: ['admin','gestor','medico'] },
  { href: '/cuadrante',  label: 'Cuadrante',  icon: <ClipboardList size={20} />,   roles: ['admin','gestor','medico'] },
  { href: '/festivos',   label: 'Festivos',   icon: <Star size={20} />,            roles: ['admin','gestor'] },
  { href: '/penosidad',  label: 'Penosidad',  icon: <Settings size={20} />,        roles: ['admin','gestor'] },
  { href: '/equipo',     label: 'Equipo',     icon: <Building2 size={20} />,       roles: ['admin','gestor','medico'] },
]

export function MobileNav({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const items = NAV.filter(n => (n.roles as string[]).includes(role))

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex z-50">
      {items.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
              active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
