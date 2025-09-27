'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Calendar, 
  Users, 
  MapPin, 
  Settings, 
  BarChart3, 
  UserCheck,
  Plus,
  CalendarPlus
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Eventos', href: '/admin/eventos', icon: Calendar },
  { name: 'Criar Evento', href: '/admin/eventos/novo', icon: CalendarPlus },
  { name: 'Agendamentos', href: '/admin/agendamentos', icon: Plus },
  { name: 'Usuários', href: '/admin/usuarios', icon: Users },
  { name: 'Comunidades', href: '/admin/comunidades', icon: MapPin },
  { name: 'Relatórios', href: '/admin/relatorios', icon: BarChart3 },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col px-4 py-6">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-50',
                      isActive
                        ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                        : 'text-gray-700 hover:text-gray-900'
                    )}
                    data-testid={`sidebar-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isActive ? 'text-orange-600' : 'text-gray-500 group-hover:text-gray-700'
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            data-testid="back-to-site-link"
          >
            <Home className="w-4 h-4" />
            Voltar ao Site
          </Link>
        </div>
      </div>
    </div>
  )
}