'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, DollarSign, Users, AlertCircle, User, Phone, MessageSquare, CheckCircle } from 'lucide-react'
import UnifiedHeader from '@/components/UnifiedHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

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
  category: string
  requirements: string
  max_participants: number
}

interface TimeSlot {
  time: string
  available: boolean
  booked: number
}

export default function ServiceBookingPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  
  const communitySlug = params?.comunidade as string
  const serviceId = params?.servico as string
  
  const [community, setCommunity] = useState<Community | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  
  // Form data
  const [contactPhone, setContactPhone] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (communitySlug && serviceId) {
      fetchServiceData()
    }
  }, [communitySlug, serviceId])

  useEffect(() => {
    if (selectedDate && service) {
      fetchTimeSlots()
    }
  }, [selectedDate, service])

  const fetchServiceData = async () => {
    try {
      const supabase = createClient()
      
      // Fetch community
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select('id, name, slug')
        .eq('slug', communitySlug)
        .single()

      if (communityError) throw communityError
      setCommunity(communityData)

      // Fetch service
      const { data: serviceData, error: serviceError } = await supabase
        .from('community_services')
        .select('*')
        .eq('id', serviceId)
        .eq('community_id', communityData.id)
        .single()

      if (serviceError) throw serviceError
      setService(serviceData)

      // Set default date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setSelectedDate(tomorrow.toISOString().split('T')[0])
      
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      // Fallback to mock data for development
      const { mockCommunities, mockServices } = await import('@/lib/mock-data')
      const community = mockCommunities.find(c => c.slug === communitySlug)
      const service = mockServices.find(s => s.id === serviceId)
      
      if (community && service) {
        setCommunity(community)
        setService(service)
        
        // Set default date to tomorrow
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        setSelectedDate(tomorrow.toISOString().split('T')[0])
      } else {
        setError('Serviço não encontrado.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchTimeSlots = async () => {
    if (!service || !selectedDate) return

    try {
      const supabase = createClient()
      const selectedDateObj = new Date(selectedDate)
      const dayOfWeek = selectedDateObj.getDay() // 0 = Sunday, 6 = Saturday

      // Get availability for this service and day
      const { data: availability, error: availError } = await supabase
        .from('service_availability')
        .select('*')
        .eq('service_id', service.id)
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true)

      if (availError) throw availError

      if (!availability || availability.length === 0) {
        setTimeSlots([])
        return
      }

      // Get existing appointments for this date
      const { data: appointments, error: appError } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('service_id', service.id)
        .eq('appointment_date', selectedDate)
        .in('status', ['scheduled', 'confirmed'])

      if (appError) throw appError

      // Generate time slots
      const slots: TimeSlot[] = []
      
      for (const avail of availability) {
        const startTime = new Date(`2000-01-01 ${avail.start_time}`)
        const endTime = new Date(`2000-01-01 ${avail.end_time}`)
        const slotDuration = service.duration_minutes * 60 * 1000 // Convert to milliseconds
        
        let currentTime = new Date(startTime)
        
        while (currentTime < endTime) {
          const timeString = currentTime.toTimeString().slice(0, 5)
          
          // Check if this time slot conflicts with existing appointments
          const conflicts = appointments?.filter(apt => {
            const aptStart = new Date(`2000-01-01 ${apt.start_time}`)
            const aptEnd = new Date(`2000-01-01 ${apt.end_time}`)
            return currentTime < aptEnd && currentTime >= aptStart
          }).length || 0

          slots.push({
            time: timeString,
            available: conflicts < avail.max_slots,
            booked: conflicts
          })
          
          currentTime = new Date(currentTime.getTime() + slotDuration)
        }
      }
      
      setTimeSlots(slots)
    } catch (error) {
      console.error('Erro ao carregar horários:', error)
      setTimeSlots([])
    }
  }

  const handleBooking = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    if (!selectedDate || !selectedTime || !contactPhone.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setBookingLoading(true)
    
    try {
      const supabase = createClient()
      
      // Calculate end time
      const startTime = new Date(`2000-01-01 ${selectedTime}`)
      const endTime = new Date(startTime.getTime() + service!.duration_minutes * 60 * 1000)
      const endTimeString = endTime.toTimeString().slice(0, 5)

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          service_id: service!.id,
          appointment_date: selectedDate,
          start_time: selectedTime,
          end_time: endTimeString,
          contact_phone: contactPhone,
          notes: notes.trim() || null,
          status: 'scheduled'
        })
        .select()

      if (error) throw error

      setBookingSuccess(true)
      
      // Refresh time slots to show updated availability
      fetchTimeSlots()
      
    } catch (error: any) {
      console.error('Erro ao agendar:', error)
      alert('Erro ao realizar agendamento. Tente novamente.')
    } finally {
      setBookingLoading(false)
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `${hours}h`
    return `${hours}h ${remainingMinutes}min`
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito'
    return `R$ ${price.toFixed(2).replace('.', ',')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayOfWeek = date.getDay()
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(date.toISOString().split('T')[0])
      }
    }
    
    return dates
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader variant="main" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando informações do serviço...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !community || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader variant="main" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Serviço não encontrado</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link 
              href={`/agendamento/${communitySlug}`}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Voltar para Serviços
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader variant="main" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Agendamento Realizado!</h2>
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{community.name}</p>
              <p className="text-sm text-gray-600 mb-1">{formatDate(selectedDate)}</p>
              <p className="text-sm text-gray-600 mb-1">{selectedTime}</p>
              <p className="text-sm font-medium text-green-600">{formatPrice(service.price)}</p>
            </div>
            <p className="text-gray-600 mb-6">
              Você receberá uma confirmação em breve. Chegue 15 minutos antes do horário agendado.
            </p>
            <div className="space-y-3">
              <Link 
                href="/perfil/pedidos"
                className="block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Ver Meus Agendamentos
              </Link>
              <Link 
                href={`/agendamento/${communitySlug}`}
                className="block bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Agendar Outro Serviço
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showLoginPrompt) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader variant="main" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <User className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Login Necessário</h2>
            <p className="text-gray-600 mb-6">
              Para finalizar seu agendamento, você precisa fazer login ou criar uma conta.
            </p>
            <div className="space-y-3">
              <Link 
                href={`/auth/login?redirect=/agendamento/${communitySlug}/${serviceId}&date=${selectedDate}&time=${selectedTime}`}
                className="block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Fazer Login
              </Link>
              <Button 
                variant="outline"
                onClick={() => setShowLoginPrompt(false)}
                className="w-full"
              >
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader variant="main" />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/agendamento/${communitySlug}`} className="text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{service.name}</h1>
              <p className="text-sm text-gray-600">{community.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Service Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informações do Serviço</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">{service.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">{formatDuration(service.duration_minutes)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-500" />
                  <span className={`text-sm ${service.price === 0 ? 'text-green-600 font-medium' : ''}`}>
                    {formatPrice(service.price)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">Máx. {service.max_participants}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">Seg-Sex</span>
                </div>
              </div>

              {service.requirements && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Requisitos:</h4>
                  <p className="text-sm text-blue-700">{service.requirements}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Agendar Horário</h2>
            
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione a Data
                </Label>
                <select
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {getAvailableDates().map(date => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Horários Disponíveis
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedTime === slot.time
                            ? 'bg-orange-500 text-white border-orange-500'
                            : slot.available
                            ? 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                  {timeSlots.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nenhum horário disponível para esta data
                    </p>
                  )}
                </div>
              )}

              {/* Contact Form */}
              {selectedTime && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone de Contato *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Observações (opcional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Alguma informação adicional..."
                      rows={3}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Booking Button */}
              {selectedTime && (
                <Button
                  onClick={handleBooking}
                  disabled={bookingLoading || !contactPhone.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                >
                  {bookingLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Agendando...
                    </div>
                  ) : (
                    'Confirmar Agendamento'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}