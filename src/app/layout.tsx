import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Guardias',
  description: 'Gestión de guardias del servicio de Urología del Hospital de Galdakao (Osakidetza)',
  icons: { icon: '/icon.svg' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-gray-900 antialiased">{children}</body>
    </html>
  )
}
