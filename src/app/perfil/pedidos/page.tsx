'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import UnifiedHeader from '@/components/UnifiedHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Calendar,
  MapPin,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Order } from '@/types/database.types'

interface OrderWithDetails extends Order {
  order_items?: Array<{
    product_name: string
    quantity: number
    price: number
  }>
}

export default function PedidosPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      setError('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800', icon: Package },
      shipping: { label: 'Em Transporte', color: 'bg-purple-100 text-purple-800', icon: Truck },
      delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const filterOrdersByStatus = (status?: string) => {
    if (!status) return orders
    return orders.filter(order => order.status === status)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader variant="main" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando pedidos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const OrderCard = ({ order }: { order: OrderWithDetails }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Pedido #{order.id.slice(0, 8)}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(order.created_at).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                R$ {order.total.toFixed(2)}
              </div>
            </div>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Items do Pedido */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Itens</h4>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-1">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name || `Item ${index + 1}`} x {item.quantity || 1}</span>
                    <span>R$ {(item.price || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Detalhes dos itens não disponíveis</p>
            )}
          </div>

          {/* Endereço de Entrega */}
          {order.shipping_address && (
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Endereço de Entrega
              </h4>
              <p className="text-sm text-gray-600">
                {typeof order.shipping_address === 'string' 
                  ? order.shipping_address 
                  : 'Endereço não disponível'}
              </p>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm">
              Ver Detalhes
            </Button>
            {order.status === 'pending' && (
              <Button variant="outline" size="sm">
                Cancelar
              </Button>
            )}
            {order.status === 'delivered' && (
              <Button variant="outline" size="sm">
                Avaliar Produtos
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader variant="main" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/perfil">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Meus Pedidos</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Tabs defaultValue="todos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="todos">Todos ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({filterOrdersByStatus('pending').length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmados ({filterOrdersByStatus('confirmed').length})</TabsTrigger>
            <TabsTrigger value="shipping">Em Transporte ({filterOrdersByStatus('shipping').length})</TabsTrigger>
            <TabsTrigger value="delivered">Entregues ({filterOrdersByStatus('delivered').length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados ({filterOrdersByStatus('cancelled').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            {orders.length > 0 ? (
              <div>
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Você ainda não fez nenhum pedido
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Explore nosso marketplace e faça sua primeira compra!
                  </p>
                  <Link href="/marketplace">
                    <Button className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400">
                      Começar a Comprar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'].map(status => (
            <TabsContent key={status} value={status}>
              {filterOrdersByStatus(status).length > 0 ? (
                <div>
                  {filterOrdersByStatus(status).map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Nenhum pedido encontrado
                    </h3>
                    <p className="text-gray-600">
                      Você não possui pedidos com este status.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}