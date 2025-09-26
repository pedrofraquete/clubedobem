'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import UnifiedHeader from '@/components/UnifiedHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Mail, 
  Calendar,
  Package,
  Star,
  Settings,
  CreditCard,
  Bell,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PerfilPage() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader variant="main" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const userName = profile?.full_name || user.email?.split('@')[0] || 'Usuário'
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader variant="main" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header do Perfil */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || ''} alt={userName} />
              <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{userName}</h1>
                <Badge variant="secondary" className="w-fit">
                  {profile?.role === 'buyer' ? 'Comprador' : profile?.role === 'seller' ? 'Vendedor' : 'Admin'}
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde {new Date(profile?.created_at || user.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            
            <Link href="/perfil/editar">
              <Button className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400">
                <Settings className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </Link>
          </div>
        </div>

        {/* Cards de Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/perfil/pedidos" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Meus Pedidos</h3>
                    <p className="text-sm text-gray-600">Acompanhe seus pedidos</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/favoritos" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Favoritos</h3>
                    <p className="text-sm text-gray-600">Produtos salvos</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/carrinho" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Carrinho</h3>
                    <p className="text-sm text-gray-600">Items selecionados</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/perfil/configuracoes" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Settings className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Configurações</h3>
                    <p className="text-sm text-gray-600">Preferências da conta</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Atividade Recente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <ShoppingBag className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bem-vindo ao Marketplace!</p>
                    <p className="text-xs text-gray-600">Explore produtos incríveis de empreendedores locais</p>
                    <p className="text-xs text-gray-500 mt-1">Hoje</p>
                  </div>
                </div>
                
                <div className="text-center py-6">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
                  <Link href="/marketplace">
                    <Button variant="outline" size="sm" className="mt-2">
                      Começar a Comprar
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Nome</span>
                  <span className="text-sm font-medium">{userName}</span>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Tipo de Conta</span>
                  <Badge variant="outline">
                    {profile?.role === 'buyer' ? 'Comprador' : profile?.role === 'seller' ? 'Vendedor' : 'Admin'}
                  </Badge>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
                
                <Link href="/perfil/editar" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    Atualizar Informações
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Transforme Comunidades com Suas Compras</h2>
            <p className="text-lg mb-6 opacity-90">
              Cada produto que você compra gera impacto social real nas periferias do Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button className="bg-white text-orange-600 hover:bg-gray-100">
                  Explorar Marketplace
                </Button>
              </Link>
              {profile?.role === 'buyer' && (
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Quero Ser Vendedor
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}