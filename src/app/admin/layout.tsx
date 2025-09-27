'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Toaster } from '@/components/ui/sonner'

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
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/login?redirect=/admin')
        return
      }

      // Verificar se o usuário tem role de admin
      const { data: userData, error } = await supabase
        .from('users')
        .select('id, email, role, full_name')
        .eq('id', session.user.id)
        .single()

      if (error || !userData) {
        router.push('/?error=access-denied')
        return
      }

      // Para demonstração: aceitar admin@teste.com como admin
      if (userData.email === 'admin@teste.com') {
        userData.role = 'admin'
        userData.full_name = 'Administrador de Teste'
      }

      if (userData.role !== 'admin') {
        router.push('/?error=access-denied')
        return
      }

      setUser(userData)
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      router.push('/auth/login?redirect=/admin')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso administrativo...</p>
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