'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, Clock, MapPin, Users, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description?: string
  event_date: string
  start_time: string
  end_time: string
  total_capacity: number
  slots_per_hour: number
  community_id: string
  service_id: string
  status: string
  created_at: string
  communities: {
    name: string
  }
  community_services: {
    name: string
  }
  // Cálculo de vagas ocupadas (mockado por enquanto)
  registered_count?: number
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  full: 'bg-orange-100 text-orange-800',
  completed: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  active: 'Ativo',
  inactive: 'Inativo', 
  full: 'Lotado',
  completed: 'Concluído'
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, statusFilter])

  const fetchEvents = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          communities (
            name
          ),
          community_services (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Buscar contagem de inscrições para cada evento
      const eventsWithCount = await Promise.all(
        (data || []).map(async (event) => {
          const { count } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact' })
            .eq('event_id', event.id)
            .eq('status', 'confirmed')

          return {
            ...event,
            registered_count: count || 0
          }
        })
      )

      setEvents(eventsWithCount)
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
      toast.error('Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.communities.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.community_services.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter)
    }

    setFilteredEvents(filtered)
  }

  const updateEventStatus = async (eventId: string, newStatus: string) => {
    try {
      // Em produção, isso seria uma update no Supabase
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      )
      toast.success('Status do evento atualizado com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status do evento')
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return

    try {
      // Em produção, isso seria um delete no Supabase
      setEvents(prev => prev.filter(event => event.id !== eventId))
      toast.success('Evento excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir evento:', error)
      toast.error('Erro ao excluir evento')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  const calculateTimeSlots = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return Math.floor(diffHours)
  }

  const getAvailabilityColor = (registered: number, total: number) => {
    const percentage = (registered / total) * 100
    if (percentage >= 100) return 'text-red-600'
    if (percentage >= 80) return 'text-orange-600'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-green-600'
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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Eventos</h1>
          <p className="text-gray-600 mt-2">Crie e gerencie eventos que aparecem na página de agendamento</p>
        </div>
        <Link href="/admin/eventos/novo">
          <Button data-testid="new-event-button">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Total de Eventos
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-blue-900">
              {events.length}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Eventos Ativos
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-green-900">
              {events.filter(e => e.status === 'active').length}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total de Inscrições
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-orange-900">
              {events.reduce((sum, e) => sum + (e.registered_count || 0), 0)}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Vagas Totais
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-purple-900">
              {events.reduce((sum, e) => sum + e.total_capacity, 0)}
            </CardDescription>
          </CardHeader>
        </Card>
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
                  placeholder="Buscar por título, comunidade ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-events-input"
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
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="full">Lotado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos ({filteredEvents.length})</CardTitle>
          <CardDescription>Lista de todos os eventos criados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Data/Horário</TableHead>
                <TableHead>Comunidade</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} data-testid={`event-row-${event.id}`}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{event.title}</span>
                      <span className="text-sm text-gray-600">{event.community_services.name}</span>
                      {event.description && (
                        <span className="text-xs text-gray-500 mt-1">{event.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{formatDate(event.event_date)}</span>
                      <span className="text-sm text-gray-600">
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {calculateTimeSlots(event.start_time, event.end_time)} slots de 1h
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {event.communities.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={`font-medium ${getAvailabilityColor(event.registered_count || 0, event.total_capacity)}`}>
                        {event.registered_count || 0} / {event.total_capacity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.slots_per_hour} vagas/hora
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                      {statusLabels[event.status as keyof typeof statusLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-testid={`view-event-${event.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-testid={`edit-event-${event.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateEventStatus(event.id, event.status === 'active' ? 'inactive' : 'active')}
                        className={event.status === 'active' ? 'text-red-600' : 'text-green-600'}
                        data-testid={`toggle-event-${event.id}`}
                      >
                        {event.status === 'active' ? 'Desativar' : 'Ativar'}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`delete-event-${event.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500" data-testid="no-events-message">
              Nenhum evento encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}