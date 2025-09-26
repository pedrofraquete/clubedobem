'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, Phone, Mail, Clock, Users } from 'lucide-react'
import UnifiedHeader from '@/components/UnifiedHeader'
import { createClient } from '@/lib/supabase'

interface Community {
  id: string
  name: string
  slug: string
  description: string
  address: string
  phone: string
  email: string
  image_url: string
  operating_hours: any
}

export default function AgendamentoPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommunities()
  }, [])

  const fetchCommunities = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setCommunities(data || [])
    } catch (error) {
      console.error('Erro ao carregar comunidades:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOperatingHoursText = (operatingHours: any) => {
    if (!operatingHours) return 'Segunda a Sexta: 8h às 18h'
    
    const weekdays = operatingHours.monday && operatingHours.tuesday && 
                    operatingHours.wednesday && operatingHours.thursday && 
                    operatingHours.friday
    
    if (weekdays && !weekdays.closed) {
      return `Segunda a Sexta: ${operatingHours.monday.start} às ${operatingHours.monday.end}`
    }
    
    return 'Segunda a Sexta: 8h às 18h'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader variant="main" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando comunidades...</p>
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
            <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Agendamento de Serviços</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Escolha sua Comunidade
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Selecione a comunidade onde você gostaria de agendar um serviço. 
            Oferecemos atendimento de qualidade com profissionais qualificados.
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {communities.map((community) => (
            <Link
              key={community.id}
              href={`/agendamento/${community.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Community Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={community.image_url}
                  alt={community.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {community.name}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {community.description}
                  </p>
                </div>
              </div>

              {/* Community Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm">{community.address}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">{community.phone}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">{community.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    {getOperatingHoursText(community.operating_hours)}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>Ver serviços disponíveis</span>
                    </div>
                    <div className="text-orange-500 font-semibold group-hover:text-orange-600 transition-colors">
                      Agendar →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-orange-50 to-teal-50 rounded-2xl p-8 mt-12">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🤝 Como Funciona
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">1</div>
                <h4 className="font-semibold text-gray-800 mb-2">Escolha a Comunidade</h4>
                <p className="text-sm text-gray-600">Selecione entre Paraisópolis ou Heliópolis</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">2</div>
                <h4 className="font-semibold text-gray-800 mb-2">Selecione o Serviço</h4>
                <p className="text-sm text-gray-600">Escolha entre os serviços disponíveis</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">3</div>
                <h4 className="font-semibold text-gray-800 mb-2">Confirme o Horário</h4>
                <p className="text-sm text-gray-600">Faça login e finalize seu agendamento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}