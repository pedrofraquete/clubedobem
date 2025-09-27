'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'
import { Users, Calendar, MapPin, TrendingUp, Clock, CheckCircle } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalAppointments: number
  totalCommunities: number
  appointmentsToday: number
  pendingAppointments: number
  completedAppointments: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAppointments: 0,
    totalCommunities: 0,
    appointmentsToday: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const supabase = createClient()
      const today = new Date().toISOString().split('T')[0]

      // Buscar estatísticas em paralelo
      const [
        usersResult,
        appointmentsResult,
        communitiesResult,
        todayAppointmentsResult,
        pendingAppointmentsResult,
        completedAppointmentsResult
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('appointments').select('id', { count: 'exact' }),
        supabase.from('communities').select('id', { count: 'exact' }),
        supabase.from('appointments').select('id', { count: 'exact' }).eq('appointment_date', today),
        supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'scheduled'),
        supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'completed')
      ])

      setStats({
        totalUsers: usersResult.count || 0,
        totalAppointments: appointmentsResult.count || 0,
        totalCommunities: communitiesResult.count || 0,
        appointmentsToday: todayAppointmentsResult.count || 0,
        pendingAppointments: pendingAppointmentsResult.count || 0,
        completedAppointments: completedAppointmentsResult.count || 0
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema de agendamentos e usuários</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card data-testid="total-users-card" className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total de Usuários
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-blue-900">
              {stats.totalUsers.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600">Usuários registrados no sistema</p>
          </CardContent>
        </Card>

        <Card data-testid="total-appointments-card" className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Total de Agendamentos
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-green-900">
              {stats.totalAppointments.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">Agendamentos realizados</p>
          </CardContent>
        </Card>

        <Card data-testid="total-communities-card" className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Comunidades Ativas
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-orange-900">
              {stats.totalCommunities.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-orange-600">Centros comunitários cadastrados</p>
          </CardContent>
        </Card>

        <Card data-testid="today-appointments-card" className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Agendamentos Hoje
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-purple-900">
              {stats.appointmentsToday.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-purple-600">Atendimentos programados para hoje</p>
          </CardContent>
        </Card>

        <Card data-testid="pending-appointments-card" className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Agendamentos Pendentes
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-yellow-900">
              {stats.pendingAppointments.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600">Aguardando confirmação</p>
          </CardContent>
        </Card>

        <Card data-testid="completed-appointments-card" className="bg-gradient-to-br from-teal-50 to-cyan-100 border-teal-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-teal-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Agendamentos Concluídos
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-teal-900">
              {stats.completedAppointments.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-teal-600">Atendimentos finalizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card data-testid="quick-actions-card">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/agendamentos"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              data-testid="manage-appointments-link"
            >
              <Calendar className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">Gerenciar Agendamentos</h3>
              <p className="text-sm text-gray-600 mt-1">Visualizar e editar agendamentos</p>
            </a>

            <a
              href="/admin/usuarios"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              data-testid="manage-users-link"
            >
              <Users className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">Gerenciar Usuários</h3>
              <p className="text-sm text-gray-600 mt-1">Editar perfis e permissões</p>
            </a>

            <a
              href="/admin/comunidades"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              data-testid="manage-communities-link"
            >
              <MapPin className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">Gerenciar Comunidades</h3>
              <p className="text-sm text-gray-600 mt-1">Adicionar e editar comunidades</p>
            </a>

            <a
              href="/admin/agendamentos/novo"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              data-testid="new-appointment-link"
            >
              <TrendingUp className="w-8 h-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">Novo Agendamento</h3>
              <p className="text-sm text-gray-600 mt-1">Criar agendamento manualmente</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}