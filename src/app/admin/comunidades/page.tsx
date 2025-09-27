'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { MapPin, Plus, Edit, Trash2, Search, Phone, Mail, Clock } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Community {
  id: string
  name: string
  slug: string
  description?: string
  address?: string
  phone?: string
  email?: string
  image_url?: string
  operating_hours?: any
  is_active: boolean
  created_at: string
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(null)
  const [showNewCommunityDialog, setShowNewCommunityDialog] = useState(false)

  useEffect(() => {
    fetchCommunities()
  }, [])

  useEffect(() => {
    filterCommunities()
  }, [communities, searchTerm])

  const fetchCommunities = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCommunities(data || [])
    } catch (error) {
      console.error('Erro ao carregar comunidades:', error)
      toast.error('Erro ao carregar comunidades')
    } finally {
      setLoading(false)
    }
  }

  const filterCommunities = () => {
    let filtered = communities

    if (searchTerm) {
      filtered = filtered.filter(community => 
        community.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCommunities(filtered)
  }

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const saveCommunity = async (communityData: Omit<Community, 'id' | 'created_at'>) => {
    try {
      const supabase = createClient()
      
      // Gerar slug automaticamente
      const slug = createSlug(communityData.name)
      
      const { data, error } = await supabase
        .from('communities')
        .insert([{ ...communityData, slug }])
        .select()

      if (error) throw error

      if (data) {
        setCommunities(prev => [data[0], ...prev])
        setShowNewCommunityDialog(false)
        toast.success('Comunidade criada com sucesso')
      }
    } catch (error) {
      console.error('Erro ao criar comunidade:', error)
      toast.error('Erro ao criar comunidade')
    }
  }

  const updateCommunity = async (communityId: string, updates: Partial<Community>) => {
    try {
      const supabase = createClient()
      
      // Se o nome mudou, atualizar o slug também
      if (updates.name) {
        updates.slug = createSlug(updates.name)
      }
      
      const { error } = await supabase
        .from('communities')
        .update(updates)
        .eq('id', communityId)

      if (error) throw error

      // Atualizar o estado local
      setCommunities(prev => 
        prev.map(community => 
          community.id === communityId ? { ...community, ...updates } : community
        )
      )

      setEditingCommunity(null)
      toast.success('Comunidade atualizada com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar comunidade:', error)
      toast.error('Erro ao atualizar comunidade')
    }
  }

  const deleteCommunity = async (communityId: string, communityName: string) => {
    if (!confirm(`Tem certeza que deseja excluir a comunidade "${communityName}"?`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', communityId)

      if (error) throw error

      setCommunities(prev => prev.filter(community => community.id !== communityId))
      toast.success('Comunidade excluída com sucesso')
    } catch (error) {
      console.error('Erro ao excluir comunidade:', error)
      toast.error('Erro ao excluir comunidade')
    }
  }

  const toggleCommunityStatus = async (communityId: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('communities')
        .update({ is_active: !currentStatus })
        .eq('id', communityId)

      if (error) throw error

      setCommunities(prev => 
        prev.map(community => 
          community.id === communityId 
            ? { ...community, is_active: !currentStatus } 
            : community
        )
      )

      toast.success(
        !currentStatus ? 'Comunidade ativada com sucesso' : 'Comunidade desativada com sucesso'
      )
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      toast.error('Erro ao alterar status da comunidade')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const CommunityForm = ({ 
    community, 
    onSubmit, 
    onCancel 
  }: { 
    community?: Community
    onSubmit: (data: Omit<Community, 'id' | 'created_at'>) => void
    onCancel: () => void
  }) => (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      onSubmit({
        name: formData.get('name') as string,
        slug: '',
        description: formData.get('description') as string,
        address: formData.get('address') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        image_url: formData.get('image_url') as string,
        operating_hours: null,
        is_active: true
      })
    }} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome da Comunidade *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={community?.name || ''}
          required
          data-testid="community-name-input"
        />
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={community?.description || ''}
          data-testid="community-description-input"
        />
      </div>
      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          defaultValue={community?.address || ''}
          data-testid="community-address-input"
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={community?.phone || ''}
          data-testid="community-phone-input"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={community?.email || ''}
          data-testid="community-email-input"
        />
      </div>
      <div>
        <Label htmlFor="image_url">URL da Imagem</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={community?.image_url || ''}
          placeholder="https://exemplo.com/imagem.jpg"
          data-testid="community-image-input"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" data-testid="save-community-button">
          {community ? 'Atualizar' : 'Criar'} Comunidade
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} data-testid="cancel-community-button">
          Cancelar
        </Button>
      </div>
    </form>
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Comunidades</h1>
          <p className="text-gray-600 mt-2">Visualize e gerencie comunidades do sistema de agendamento</p>
        </div>
        <Dialog open={showNewCommunityDialog} onOpenChange={setShowNewCommunityDialog}>
          <DialogTrigger asChild>
            <Button data-testid="new-community-button">
              <Plus className="w-4 h-4 mr-2" />
              Nova Comunidade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Comunidade</DialogTitle>
              <DialogDescription>
                Adicione uma nova comunidade ao sistema de agendamento
              </DialogDescription>
            </DialogHeader>
            <CommunityForm 
              onSubmit={saveCommunity}
              onCancel={() => setShowNewCommunityDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Total de Comunidades
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-blue-900">
              {communities.length}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Comunidades Ativas
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-green-900">
              {communities.filter(c => c.is_active).length}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Comunidades Inativas
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-red-900">
              {communities.filter(c => !c.is_active).length}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Comunidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, endereço ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="search-communities-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Communities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comunidades ({filteredCommunities.length})</CardTitle>
          <CardDescription>Lista de todas as comunidades registradas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comunidade</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommunities.map((community) => (
                <TableRow key={community.id} data-testid={`community-row-${community.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {community.image_url && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={community.image_url}
                            alt={community.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{community.name}</span>
                        <span className="text-sm text-gray-600">{community.description}</span>
                        {community.address && (
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {community.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {community.phone && (
                        <span className="text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {community.phone}
                        </span>
                      )}
                      {community.email && (
                        <span className="text-sm flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {community.email}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={community.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      data-testid={`community-status-${community.id}`}
                    >
                      {community.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(community.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingCommunity(community)}
                            data-testid={`edit-community-${community.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Editar Comunidade</DialogTitle>
                            <DialogDescription>
                              Modifique as informações da comunidade
                            </DialogDescription>
                          </DialogHeader>
                          {editingCommunity && (
                            <CommunityForm 
                              community={editingCommunity}
                              onSubmit={(data) => updateCommunity(editingCommunity.id, data)}
                              onCancel={() => setEditingCommunity(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleCommunityStatus(community.id, community.is_active)}
                        className={community.is_active ? 'text-red-600' : 'text-green-600'}
                        data-testid={`toggle-community-${community.id}`}
                      >
                        {community.is_active ? 'Desativar' : 'Ativar'}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteCommunity(community.id, community.name)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`delete-community-${community.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCommunities.length === 0 && (
            <div className="text-center py-8 text-gray-500" data-testid="no-communities-message">
              Nenhuma comunidade encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}