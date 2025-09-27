'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Clock, MapPin, User, Phone, Mail, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Appointment {
  id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: string
  notes?: string
  contact_phone?: string
  user_id: string
  service_id: string
  created_at: string
  users: {
    full_name: string
    email: string
  }
  community_services: {
    name: string
    community_id: string
    communities: {
      name: string
    }
  }
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
  no_show: 'bg-orange-100 text-orange-800'
}

const statusLabels = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Concluído',
  no_show: 'Não Compareceu'
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchTerm, statusFilter])

  const fetchAppointments = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          users (
            full_name,
            email
          ),
          community_services (
            name,
            community_id,
            communities (
              name
            )
          )
        `)
        .order('appointment_date', { ascending: false })
        .order('start_time', { ascending: false })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      toast.error('Erro ao carregar agendamentos')
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.users.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.users.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.community_services.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.community_services.communities.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter)
    }

    setFilteredAppointments(filtered)
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId)

      if (error) throw error

      // Atualizar o estado local
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      )

      toast.success('Status do agendamento atualizado com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status do agendamento')
    }
  }

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)

      if (error) throw error

      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId))
      toast.success('Agendamento excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error)
      toast.error('Erro ao excluir agendamento')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Agendamentos</h1>
          <p className="text-gray-600 mt-2">Visualize e gerencie todos os agendamentos do sistema</p>
        </div>
        <Link href="/admin/agendamentos/novo">
          <Button data-testid="new-appointment-button">
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por usuário, serviço ou comunidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48" data-testid="status-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="no_show">Não Compareceu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos ({filteredAppointments.length})</CardTitle>
          <CardDescription>Lista de todos os agendamentos registrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Comunidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} data-testid={`appointment-row-${appointment.id}`}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{formatDate(appointment.appointment_date)}</span>
                      <span className="text-sm text-gray-600">
                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{appointment.users.full_name || 'N/A'}</span>
                      <span className="text-sm text-gray-600">{appointment.users.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {appointment.community_services.name}
                  </TableCell>
                  <TableCell>
                    {appointment.community_services.communities.name}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                      {statusLabels[appointment.status as keyof typeof statusLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAppointment(appointment)}
                            data-testid={`view-appointment-${appointment.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Gerenciar Agendamento</DialogTitle>
                            <DialogDescription>
                              Altere o status do agendamento
                            </DialogDescription>
                          </DialogHeader>
                          {selectedAppointment && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Status Atual:</label>
                                <Badge className={statusColors[selectedAppointment.status as keyof typeof statusColors]}>
                                  {statusLabels[selectedAppointment.status as keyof typeof statusLabels]}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Alterar para:</label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'confirmed')}
                                    disabled={selectedAppointment.status === 'confirmed'}
                                    data-testid="confirm-appointment-button"
                                  >
                                    Confirmar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completed')}
                                    disabled={selectedAppointment.status === 'completed'}
                                    data-testid="complete-appointment-button"
                                  >
                                    Concluir
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelled')}
                                    disabled={selectedAppointment.status === 'cancelled'}
                                    data-testid="cancel-appointment-button"
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'no_show')}
                                    disabled={selectedAppointment.status === 'no_show'}
                                    data-testid="no-show-appointment-button"
                                  >
                                    Não Compareceu
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`delete-appointment-${appointment.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500" data-testid="no-appointments-message">
              Nenhum agendamento encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}