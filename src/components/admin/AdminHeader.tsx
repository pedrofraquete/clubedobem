'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, LogOut, Settings, User } from 'lucide-react'
import { toast } from 'sonner'

interface AdminHeaderProps {
  user: {
    id: string
    email: string
    full_name?: string
    role: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success('Logout realizado com sucesso')
      router.push('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      toast.error('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()
    }
    return email?.charAt(0).toUpperCase() || 'A'
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Painel Administrativo
          </h2>
          <p className="text-sm text-gray-600">
            Gerencie agendamentos e usuários do sistema
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative" data-testid="notifications-button">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="user-menu-button">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar_url} alt={user?.full_name || user?.email} />
                <AvatarFallback className="bg-orange-500 text-white">
                  {getInitials(user?.full_name, user?.email)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.full_name || 'Administrador'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <p className="text-xs text-orange-600 font-medium">
                  {user?.role === 'admin' ? 'Administrador' : user?.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="profile-menu-item">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="settings-menu-item">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleSignOut} 
              disabled={loading}
              data-testid="logout-menu-item"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}