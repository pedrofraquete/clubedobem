'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, DollarSign, Users, AlertCircle, Calendar } from 'lucide-react'
import UnifiedHeader from '@/components/UnifiedHeader'
import { createClient } from '@/lib/supabase'

interface Community {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
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

export default function CommunityServicesPage() {
  const params = useParams()
  const communitySlug = params?.comunidade as string
  
  const [community, setCommunity] = useState<Community | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (communitySlug) {
      fetchCommunityAndServices()
    }
  }, [communitySlug])

  const fetchCommunityAndServices = async () => {
    try {
      const supabase = createClient()
      
      // Fetch community
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select('*')
        .eq('slug', communitySlug)
        .single()

      if (communityError) throw communityError
      setCommunity(communityData)

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('community_services')
        .select('*')
        .eq('community_id', communityData.id)
        .eq('is_active', true)
        .order('category', { ascending: true })

      if (servicesError) throw servicesError
      setServices(servicesData || [])
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      setError('Não foi possível carregar os serviços desta comunidade.')
    } finally {
      setLoading(false)
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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Saúde': 'bg-red-100 text-red-700 border-red-200',
      'Educação': 'bg-blue-100 text-blue-700 border-blue-200',
      'Capacitação': 'bg-green-100 text-green-700 border-green-200',
      'Jurídico': 'bg-purple-100 text-purple-700 border-purple-200'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Saúde': '🏥',
      'Educação': '📚',
      'Capacitação': '🛠️',
      'Jurídico': '⚖️'
    }
    return icons[category as keyof typeof icons] || '📋'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader variant="main" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando serviços...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !community) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader variant="main" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Comunidade não encontrada</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link 
              href="/agendamento"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Voltar para Seleção
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader variant="main" />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/agendamento" className="text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Serviços - {community.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Community Hero */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={community.image_url}
          alt={community.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-2">{community.name}</h2>
            <p className="text-xl text-white/90">{community.description}</p>
          </div>
        </div>
      </div>

      {/* Services Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Serviços Disponíveis
          </h3>
          <p className="text-lg text-gray-600">
            Escolha o serviço que você precisa e veja os horários disponíveis
          </p>
        </div>

        {/* Services by Category */}
        {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
          <div key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              <h4 className="text-2xl font-bold text-gray-800">{category}</h4>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}>
                {categoryServices.length} serviço{categoryServices.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/agendamento/${communitySlug}/${service.id}`}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </div>
                    <div className="text-2xl">{getCategoryIcon(service.category)}</div>
                  </div>

                  <h5 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {service.name}
                  </h5>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(service.duration_minutes)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <DollarSign className="w-4 h-4" />
                      <span className={service.price === 0 ? 'text-green-600 font-medium' : ''}>
                        {formatPrice(service.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>Máx. {service.max_participants} pessoa{service.max_participants > 1 ? 's' : ''}</span>
                    </div>

                    {service.requirements && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                        <p className="text-xs text-blue-700 font-medium mb-1">Requisitos:</p>
                        <p className="text-xs text-blue-600">{service.requirements}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Ver horários</span>
                    </div>
                    <div className="text-orange-500 font-semibold group-hover:text-orange-600 transition-colors">
                      Agendar →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum serviço disponível
            </h3>
            <p className="text-gray-500">
              Esta comunidade ainda não possui serviços cadastrados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}