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
      // TEMPORARY: Skip authentication for testing purposes
      console.log('TESTING MODE: Bypassing authentication')
      setUser({
        id: 'test-admin-id',
        email: 'admin@test.com',
        role: 'admin',
        full_name: 'Test Admin'
      })
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