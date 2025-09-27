'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Toaster } from '@/components/ui/sonner'

// Demo user para demonstração do sistema admin
const DEMO_ADMIN_USER = {
  id: 'demo-admin-123',
  email: 'admin@demo.com',
  role: 'admin',
  full_name: 'Administrador Demo'
}

interface User {
  id: string
  email: string
  role: string
  full_name?: string
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Para demonstração, vamos usar um usuário demo admin
    // Em produção, isso seria verificado com autenticação real
    setTimeout(() => {
      setUser(DEMO_ADMIN_USER)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso administrativo...</p>
          <p className="text-sm text-gray-500 mt-2">Sistema Demo - Carregando usuário admin</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <AdminHeader user={user} />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  )
}