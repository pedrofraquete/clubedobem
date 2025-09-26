'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import UnifiedHeader from '@/components/UnifiedHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  Mail,
  MessageSquare,
  Eye,
  Lock,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ConfiguracoesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [settings, setSettings] = useState({
    notifications: {
      email_orders: true,
      email_promotions: false,
      email_newsletter: true,
      push_orders: true,
      push_chat: true,
      sms_orders: false
    },
    privacy: {
      profile_visibility: true,
      show_activity: false,
      allow_messages: true,
      show_online_status: true
    },
    account: {
      two_factor: false,
      login_notifications: true,
      auto_logout: false
    }
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const handleSettingChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }))
    
    // Simular salvamento automático
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader variant="main" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

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
          <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-green-600">Configurações salvas automaticamente!</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_orders" className="text-sm font-medium">
                        Atualizações de Pedidos
                      </Label>
                      <p className="text-xs text-gray-500">
                        Receba emails sobre o status dos seus pedidos
                      </p>
                    </div>
                    <Switch
                      id="email_orders"
                      checked={settings.notifications.email_orders}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'email_orders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_promotions" className="text-sm font-medium">
                        Promoções e Ofertas
                      </Label>
                      <p className="text-xs text-gray-500">
                        Receba ofertas especiais e cupons de desconto
                      </p>
                    </div>
                    <Switch
                      id="email_promotions"
                      checked={settings.notifications.email_promotions}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'email_promotions', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_newsletter" className="text-sm font-medium">
                        Newsletter
                      </Label>
                      <p className="text-xs text-gray-500">
                        Novidades sobre produtos e impacto social
                      </p>
                    </div>
                    <Switch
                      id="email_newsletter"
                      checked={settings.notifications.email_newsletter}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'email_newsletter', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-gray-800 mb-4">Push Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push_orders" className="text-sm font-medium">
                        Pedidos
                      </Label>
                      <p className="text-xs text-gray-500">
                        Notificações no navegador sobre pedidos
                      </p>
                    </div>
                    <Switch
                      id="push_orders"
                      checked={settings.notifications.push_orders}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'push_orders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push_chat" className="text-sm font-medium">
                        Mensagens
                      </Label>
                      <p className="text-xs text-gray-500">
                        Novas mensagens de vendedores
                      </p>
                    </div>
                    <Switch
                      id="push_chat"
                      checked={settings.notifications.push_chat}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'push_chat', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile_visibility" className="text-sm font-medium">
                    Perfil Público
                  </Label>
                  <p className="text-xs text-gray-500">
                    Outros usuários podem ver seu perfil básico
                  </p>
                </div>
                <Switch
                  id="profile_visibility"
                  checked={settings.privacy.profile_visibility}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'profile_visibility', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show_activity" className="text-sm font-medium">
                    Mostrar Atividade
                  </Label>
                  <p className="text-xs text-gray-500">
                    Exibir suas compras e avaliações recentes
                  </p>
                </div>
                <Switch
                  id="show_activity"
                  checked={settings.privacy.show_activity}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'show_activity', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow_messages" className="text-sm font-medium">
                    Permitir Mensagens
                  </Label>
                  <p className="text-xs text-gray-500">
                    Vendedores podem entrar em contato
                  </p>
                </div>
                <Switch
                  id="allow_messages"
                  checked={settings.privacy.allow_messages}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'allow_messages', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two_factor" className="text-sm font-medium">
                    Autenticação de Dois Fatores
                  </Label>
                  <p className="text-xs text-gray-500">
                    Adicione uma camada extra de segurança
                  </p>
                </div>
                <Switch
                  id="two_factor"
                  checked={settings.account.two_factor}
                  onCheckedChange={(checked) => handleSettingChange('account', 'two_factor', checked)}
                  disabled
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="login_notifications" className="text-sm font-medium">
                    Notificações de Login
                  </Label>
                  <p className="text-xs text-gray-500">
                    Avise sobre novos acessos à sua conta
                  </p>
                </div>
                <Switch
                  id="login_notifications"
                  checked={settings.account.login_notifications}
                  onCheckedChange={(checked) => handleSettingChange('account', 'login_notifications', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Lock className="w-4 h-4 mr-2" />
                  Alterar Senha
                  <span className="text-xs ml-auto">(Em breve)</span>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Shield className="w-4 h-4 mr-2" />
                  Gerenciar Dispositivos Conectados
                  <span className="text-xs ml-auto">(Em breve)</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" disabled>
                <CreditCard className="w-4 h-4 mr-2" />
                Métodos de Pagamento
                <span className="text-xs ml-auto">(Em breve)</span>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" disabled>
                <MessageSquare className="w-4 h-4 mr-2" />
                Histórico de Transações
                <span className="text-xs ml-auto">(Em breve)</span>
              </Button>
            </CardContent>
          </Card>

          {/* Zona de Perigo */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Zona de Perigo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-red-600 mb-2">Excluir Conta</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Esta ação removerá permanentemente sua conta e todos os dados associados. 
                    Esta ação não pode ser desfeita.
                  </p>
                  <Button variant="destructive" disabled>
                    Excluir Minha Conta
                    <span className="text-xs ml-2">(Em breve)</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}