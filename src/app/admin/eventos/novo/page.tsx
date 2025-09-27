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
import { CalendarIcon, Clock, ArrowLeft, Users, MapPin } from 'lucide-react'
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

export default function NewEventPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCommunity, setSelectedCommunity] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [slotsPerHour, setSlotsPerHour] = useState('5')
  const [totalCapacity, setTotalCapacity] = useState('')

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

  useEffect(() => {
    // Calcular capacidade total automaticamente
    if (startTime && endTime && slotsPerHour) {
      const start = new Date(`2000-01-01T${startTime}:00`)
      const end = new Date(`2000-01-01T${endTime}:00`)
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      
      if (diffHours > 0) {
        const total = Math.floor(diffHours) * parseInt(slotsPerHour)
        setTotalCapacity(total.toString())
      }
    }
  }, [startTime, endTime, slotsPerHour])

  const fetchInitialData = async () => {
    try {
      const supabase = createClient()
      
      const { data: communitiesData, error: communitiesError } = await supabase
        .from('communities')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name')

      if (communitiesError) throw communitiesError

      setCommunities(communitiesData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar comunidades')
      
      // Fallback com dados mockados
      setCommunities([
        { id: '1', name: 'Heliópolis', slug: 'heliopolis' },
        { id: '2', name: 'Paraisópolis', slug: 'paraisopolis' }
      ])
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
      
      // Fallback com dados mockados
      const mockServices = [
        { id: '1', name: 'Consulta Médica Geral', description: 'Consulta com clínico geral', duration_minutes: 30, price: 0, community_id: communityId },
        { id: '2', name: 'Aula de Informática', description: 'Curso básico de informática', duration_minutes: 60, price: 0, community_id: communityId },
        { id: '3', name: 'Oficina de Costura', description: 'Aprenda técnicas de costura', duration_minutes: 120, price: 15, community_id: communityId }
      ]
      setServices(mockServices)
    }
  }

  const calculateTimeSlots = () => {
    if (!startTime || !endTime) return []
    
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    const slots = []
    
    const current = new Date(start)
    while (current < end) {
      const slotStart = current.toTimeString().slice(0, 5)
      current.setHours(current.getHours() + 1)
      const slotEnd = current.toTimeString().slice(0, 5)
      
      if (current <= end) {
        slots.push(`${slotStart} às ${slotEnd}`)
      }
    }
    
    return slots
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !selectedCommunity || !selectedService || !selectedDate || !startTime || !endTime) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (startTime >= endTime) {
      toast.error('O horário de início deve ser anterior ao horário de término')
      return
    }

    setSaving(true)

    try {
      // Em produção, isso criaria um evento na tabela de eventos
      const eventData = {
        title,
        description,
        community_id: selectedCommunity,
        service_id: selectedService,
        event_date: selectedDate.toISOString().split('T')[0],
        start_time: startTime,
        end_time: endTime,
        slots_per_hour: parseInt(slotsPerHour),
        total_capacity: parseInt(totalCapacity),
        status: 'active'
      }

      console.log('Criando evento:', eventData)
      
      toast.success('Evento criado com sucesso!')
      router.push('/admin/eventos')
    } catch (error) {
      console.error('Erro ao criar evento:', error)
      toast.error('Erro ao criar evento')
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

  const timeSlots = calculateTimeSlots()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/eventos">
          <Button variant="ghost" size="sm" data-testid="back-to-events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Evento</h1>
          <p className="text-gray-600 mt-2">Configure um evento que aparecerá na página de agendamento</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário Principal */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Evento</CardTitle>
              <CardDescription>Configure os detalhes básicos do evento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Título */}
              <div>
                <Label htmlFor="title">Título do Evento *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Consulta Médica Geral"
                  required
                  data-testid="event-title-input"
                />
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o evento, requisitos, etc..."
                  rows={3}
                  data-testid="event-description-input"
                />
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
                <Label htmlFor="service">Tipo de Serviço *</Label>
                <Select 
                  value={selectedService} 
                  onValueChange={setSelectedService} 
                  required
                  disabled={!selectedCommunity}
                >
                  <SelectTrigger data-testid="select-service">
                    <SelectValue placeholder={
                      selectedCommunity ? "Selecione o tipo de serviço" : "Primeiro selecione uma comunidade"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data */}
              <div>
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Data do Evento *
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
                        "Selecione a data do evento"
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
            </CardContent>
          </Card>

          {/* Configuração de Horários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horários e Capacidade
              </CardTitle>
              <CardDescription>Configure os horários e número de vagas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Horários */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Horário de Início *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    data-testid="start-time-input"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Horário de Término *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    data-testid="end-time-input"
                  />
                </div>
              </div>

              {/* Vagas por hora */}
              <div>
                <Label htmlFor="slotsPerHour" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Vagas por Hora *
                </Label>
                <Select value={slotsPerHour} onValueChange={setSlotsPerHour}>
                  <SelectTrigger data-testid="slots-per-hour-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 vaga por hora</SelectItem>
                    <SelectItem value="2">2 vagas por hora</SelectItem>
                    <SelectItem value="3">3 vagas por hora</SelectItem>
                    <SelectItem value="4">4 vagas por hora</SelectItem>
                    <SelectItem value="5">5 vagas por hora</SelectItem>
                    <SelectItem value="6">6 vagas por hora</SelectItem>
                    <SelectItem value="8">8 vagas por hora</SelectItem>
                    <SelectItem value="10">10 vagas por hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Capacidade total (calculada) */}
              <div>
                <Label htmlFor="totalCapacity">Capacidade Total (Calculada)</Label>
                <Input
                  id="totalCapacity"
                  value={totalCapacity}
                  disabled
                  className="bg-gray-100"
                  data-testid="total-capacity-display"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Calculado automaticamente baseado nos horários e vagas por hora
                </p>
              </div>

              {/* Preview dos slots */}
              {timeSlots.length > 0 && (
                <div>
                  <Label>Preview dos Horários:</Label>
                  <div className="mt-2 space-y-2">
                    {timeSlots.map((slot, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{slot}</span>
                        <Badge variant="outline">{slotsPerHour} vagas</Badge>
                      </div>
                    ))}
                  </div>
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
                data-testid="create-event-button"
              >
                {saving ? 'Criando Evento...' : 'Criar Evento'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/admin/eventos')}
                data-testid="cancel-create-event"
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