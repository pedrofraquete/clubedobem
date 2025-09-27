'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Clock, User, MapPin, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

interface Community {
  id: string
  name: string
  slug: string
}

interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
  community_id: string
}

interface User {
  id: string
  email: string
  full_name?: string
}

export default function NewAppointmentPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [selectedCommunity, setSelectedCommunity] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [startTime, setStartTime] = useState('')
  const [notes, setNotes] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  const router = useRouter()

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (selectedCommunity) {
      fetchCommunityServices(selectedCommunity)
    } else {
      setServices([])
      setSelectedService('')
    }
  }, [selectedCommunity])

  const fetchInitialData = async () => {
    try {
      const supabase = createClient()
      
      // Buscar comunidades e usuários em paralelo
      const [communitiesResult, usersResult] = await Promise.all([
        supabase.from('communities').select('id, name, slug').eq('is_active', true).order('name'),
        supabase.from('users').select('id, email, full_name').order('full_name')
      ])

      if (communitiesResult.error) throw communitiesResult.error
      if (usersResult.error) throw usersResult.error

      setCommunities(communitiesResult.data || [])
      setUsers(usersResult.data || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados iniciais')
    } finally {
      setLoading(false)
    }
  }

  const fetchCommunityServices = async (communityId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('community_services')
        .select('id, name, description, duration_minutes, price, community_id')
        .eq('community_id', communityId)
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      toast.error('Erro ao carregar serviços da comunidade')
    }
  }

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    if (!startTime) return ''
    
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + durationMinutes
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCommunity || !selectedService || !selectedUser || !selectedDate || !startTime) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setSaving(true)

    try {
      const supabase = createClient()
      
      // Buscar informações do serviço selecionado
      const selectedServiceData = services.find(s => s.id === selectedService)
      if (!selectedServiceData) {
        throw new Error('Serviço não encontrado')
      }

      const endTime = calculateEndTime(startTime, selectedServiceData.duration_minutes)

      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: selectedUser,
          service_id: selectedService,
          appointment_date: selectedDate.toISOString().split('T')[0],
          start_time: startTime,
          end_time: endTime,
          status: 'scheduled',
          notes: notes || null,
          contact_phone: contactPhone || null
        })

      if (error) throw error

      toast.success('Agendamento criado com sucesso!')
      router.push('/admin/agendamentos')
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      toast.error('Erro ao criar agendamento')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  const selectedServiceData = services.find(s => s.id === selectedService)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/agendamentos">
          <Button variant="ghost" size="sm" data-testid="back-to-appointments">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Agendamento</h1>
          <p className="text-gray-600 mt-2">Crie um novo agendamento manualmente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário Principal */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Agendamento</CardTitle>
              <CardDescription>Preencha os dados para criar o agendamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Usuário */}
              <div>
                <Label htmlFor="user" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Usuário *
                </Label>
                <Select value={selectedUser} onValueChange={setSelectedUser} required>
                  <SelectTrigger data-testid="select-user">
                    <SelectValue placeholder="Selecione o usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.email} - {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Comunidade */}
              <div>
                <Label htmlFor="community" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Comunidade *
                </Label>
                <Select value={selectedCommunity} onValueChange={setSelectedCommunity} required>
                  <SelectTrigger data-testid="select-community">
                    <SelectValue placeholder="Selecione a comunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Serviço */}
              <div>
                <Label htmlFor="service">Serviço *</Label>
                <Select 
                  value={selectedService} 
                  onValueChange={setSelectedService} 
                  required
                  disabled={!selectedCommunity}
                >
                  <SelectTrigger data-testid="select-service">
                    <SelectValue placeholder={
                      selectedCommunity ? "Selecione o serviço" : "Primeiro selecione uma comunidade"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - {service.duration_minutes}min - R$ {service.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data */}
              <div>
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Data do Agendamento *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      data-testid="select-date-button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: ptBR })
                      ) : (
                        "Selecione a data"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Horário */}
              <div>
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horário de Início *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  data-testid="select-time-input"
                />
                {selectedServiceData && startTime && (
                  <p className="text-sm text-gray-600 mt-1">
                    Duração: {selectedServiceData.duration_minutes} minutos 
                    (até {calculateEndTime(startTime, selectedServiceData.duration_minutes)})
                  </p>
                )}
              </div>

              {/* Telefone de Contato */}
              <div>
                <Label htmlFor="phone">Telefone de Contato</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  data-testid="contact-phone-input"
                />
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações sobre o agendamento..."
                  data-testid="notes-textarea"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Agendamento</CardTitle>
              <CardDescription>Confirme os dados antes de salvar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Usuário:</h4>
                <p className="text-gray-600">
                  {selectedUser ? 
                    users.find(u => u.id === selectedUser)?.full_name || 
                    users.find(u => u.id === selectedUser)?.email || 'Não selecionado'
                    : 'Não selecionado'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Comunidade:</h4>
                <p className="text-gray-600">
                  {selectedCommunity ? 
                    communities.find(c => c.id === selectedCommunity)?.name || 'Não selecionada'
                    : 'Não selecionada'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Serviço:</h4>
                <p className="text-gray-600">
                  {selectedServiceData ? selectedServiceData.name : 'Não selecionado'}
                </p>
                {selectedServiceData && (
                  <div className="text-sm text-gray-500">
                    <p>Duração: {selectedServiceData.duration_minutes} minutos</p>
                    <p>Preço: R$ {selectedServiceData.price.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Data e Horário:</h4>
                <p className="text-gray-600">
                  {selectedDate && startTime ? (
                    <>
                      {format(selectedDate, "PPP", { locale: ptBR })} às {startTime}
                      {selectedServiceData && (
                        <span className="text-gray-500">
                          {' '}(até {calculateEndTime(startTime, selectedServiceData.duration_minutes)})
                        </span>
                      )}
                    </>
                  ) : (
                    'Não definido'
                  )}
                </p>
              </div>

              {contactPhone && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Telefone:</h4>
                  <p className="text-gray-600">{contactPhone}</p>
                </div>
              )}

              {notes && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Observações:</h4>
                  <p className="text-gray-600">{notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={saving}
                data-testid="create-appointment-button"
              >
                {saving ? 'Criando...' : 'Criar Agendamento'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/admin/agendamentos')}
                data-testid="cancel-create-appointment"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}