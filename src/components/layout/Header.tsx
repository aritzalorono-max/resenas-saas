'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'
import { Stethoscope, LogOut, UserCog, Users, BarChart3 } from 'lucide-react'

const NAV = [
  { href: '/medicos', label: 'Médicos', icon: <Users size={15} /> },
  { href: '/resumen', label: 'Resumen', icon: <BarChart3 size={15} /> },
]

export function Header({ serviceName }: { serviceName: string }) {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Stethoscope size={14} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm truncate max-w-[140px] hidden sm:block">
            {serviceName}
          </span>
        </Link>

        {/* Nav central */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Cuenta + Salir */}
        <div className="flex items-center gap-1 shrink-0">
          <Link href="/cuenta"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              pathname === '/cuenta'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}>
            <UserCog size={15} />
            <span className="hidden sm:inline">Mi cuenta</span>
          </Link>
          <form action={signOut}>
            <button type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <LogOut size={15} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
