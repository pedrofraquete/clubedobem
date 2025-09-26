'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import UnifiedHeader from '@/components/UnifiedHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Upload, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EditarPerfilPage() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading, updateProfile } = useUserProfile()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    full_name: '',
    role: 'buyer' as 'buyer' | 'seller' | 'admin',
    avatar_url: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        role: profile.role || 'buyer',
        avatar_url: profile.avatar_url || ''
      })
    }
  }, [profile])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await updateProfile(formData)
      setSuccess(true)
      setTimeout(() => {
        router.push('/perfil')
      }, 2000)
    } catch (err) {
      setError('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || profileLoading) {
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

  const userName = profile?.full_name || user.email?.split('@')[0] || 'Usuário'
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

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
          <h1 className="text-3xl font-bold text-gray-800">Editar Perfil</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna da Esquerda - Avatar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Foto de Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={formData.avatar_url || profile?.avatar_url || ''} alt={userName} />
                    <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="avatar_url" className="text-sm font-medium">
                        URL da Imagem
                      </Label>
                      <Input
                        id="avatar_url"
                        type="url"
                        placeholder="https://exemplo.com/avatar.jpg"
                        value={formData.avatar_url}
                        onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button type="button" variant="outline" className="w-full" disabled>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload de Imagem
                      <span className="text-xs ml-2">(Em breve)</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna da Direita - Informações */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nome Completo */}
                  <div>
                    <Label htmlFor="full_name" className="text-sm font-medium">
                      Nome Completo *
                    </Label>
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      O email não pode ser alterado
                    </p>
                  </div>

                  {/* Tipo de Conta */}
                  <div>
                    <Label htmlFor="role" className="text-sm font-medium">
                      Tipo de Conta
                    </Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value: 'buyer' | 'seller' | 'admin') => handleInputChange('role', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o tipo de conta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Comprador</SelectItem>
                        <SelectItem value="seller">Vendedor</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Vendedores podem cadastrar produtos no marketplace
                    </p>
                  </div>

                  {/* Data de Criação (Read-only) */}
                  <div>
                    <Label htmlFor="created_at" className="text-sm font-medium">
                      Membro desde
                    </Label>
                    <Input
                      id="created_at"
                      type="text"
                      value={new Date(profile?.created_at || user.created_at).toLocaleDateString('pt-BR')}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>

                  {/* Mensagens de Feedback */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-600">
                        Perfil atualizado com sucesso! Redirecionando...
                      </p>
                    </div>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 flex-1"
                      disabled={loading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                    
                    <Link href="/perfil" className="flex-1">
                      <Button type="button" variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {/* Seção de Segurança */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Alterar Senha</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Para alterar sua senha, você receberá um link por email.
                </p>
                <Button variant="outline" disabled>
                  Solicitar Alteração de Senha
                  <span className="text-xs ml-2">(Em breve)</span>
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-red-600 mb-2">Excluir Conta</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
                </p>
                <Button variant="destructive" disabled>
                  Excluir Conta
                  <span className="text-xs ml-2">(Em breve)</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}