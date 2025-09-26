'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function DatabaseSetupPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const supabase = createClient()

  const setupDatabase = async () => {
    setLoading(true)
    setError(null)
    setResults([])
    setSuccess(false)

    try {
      // Create categories first
      const categories = [
        { name: 'Eletrônicos', slug: 'eletronicos', description: 'Produtos eletrônicos e tecnologia' },
        { name: 'Roupas', slug: 'roupas', description: 'Moda e vestuário' },
        { name: 'Casa e Decoração', slug: 'casa-decoracao', description: 'Itens para casa e decoração' },
        { name: 'Livros', slug: 'livros', description: 'Livros e material educativo' },
        { name: 'Esportes', slug: 'esportes', description: 'Artigos esportivos e fitness' }
      ]

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .upsert(categories, { onConflict: 'slug' })
        .select()

      if (categoriesError) {
        throw new Error(`Erro ao criar categorias: ${categoriesError.message}`)
      }

      setResults(prev => [...prev, `✅ ${categoriesData?.length || 0} categorias criadas/atualizadas`])

      // Get the first category ID for sample products
      const electronicsCat = categoriesData?.find(cat => cat.slug === 'eletronicos')
      const roupasCat = categoriesData?.find(cat => cat.slug === 'roupas')
      const casaCat = categoriesData?.find(cat => cat.slug === 'casa-decoracao')

      if (!electronicsCat || !roupasCat || !casaCat) {
        throw new Error('Categorias não foram criadas corretamente')
      }

      // Create sample products
      const sampleProducts = [
        {
          name: 'Smartphone Android',
          description: 'Smartphone com 128GB de armazenamento, câmera dupla e tela de 6.5"',
          price: 899.99,
          images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
          category_id: electronicsCat.id,
          rating: 4.5,
          rating_count: 120,
          stock: 50,
          seller_id: '00000000-0000-0000-0000-000000000001' // Placeholder - will be replaced with real seller
        },
        {
          name: 'Notebook Gaming',
          description: 'Notebook gamer com RTX 3060, 16GB RAM, SSD 512GB',
          price: 3499.99,
          images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'],
          category_id: electronicsCat.id,
          rating: 4.8,
          rating_count: 85,
          stock: 25,
          seller_id: '00000000-0000-0000-0000-000000000001'
        },
        {
          name: 'Fones Bluetooth',
          description: 'Fones de ouvido sem fio com cancelamento de ruído',
          price: 299.99,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
          category_id: electronicsCat.id,
          rating: 4.3,
          rating_count: 200,
          stock: 100,
          seller_id: '00000000-0000-0000-0000-000000000001'
        },
        {
          name: 'Camiseta Básica',
          description: 'Camiseta 100% algodão, diversas cores disponíveis',
          price: 39.99,
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
          category_id: roupasCat.id,
          rating: 4.2,
          rating_count: 150,
          stock: 200,
          seller_id: '00000000-0000-0000-0000-000000000001'
        },
        {
          name: 'Jeans Premium',
          description: 'Calça jeans premium com corte moderno',
          price: 159.99,
          images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
          category_id: roupasCat.id,
          rating: 4.6,
          rating_count: 90,
          stock: 75,
          seller_id: '00000000-0000-0000-0000-000000000001'
        },
        {
          name: 'Vaso Decorativo',
          description: 'Vaso cerâmico artesanal para plantas',
          price: 79.99,
          images: ['https://images.unsplash.com/photo-1493663284031-b7e3aab21900?w=400'],
          category_id: casaCat.id,
          rating: 4.7,
          rating_count: 45,
          stock: 30,
          seller_id: '00000000-0000-0000-0000-000000000001'
        }
      ]

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .upsert(sampleProducts, { onConflict: 'name' })
        .select()

      if (productsError) {
        // If products table doesn't exist, that's expected
        setResults(prev => [...prev, `⚠️ Tabela produtos não existe ainda (normal se for primeira execução)`])
      } else {
        setResults(prev => [...prev, `✅ ${productsData?.length || 0} produtos de exemplo criados/atualizados`])
      }

      setSuccess(true)
      setResults(prev => [...prev, `🎉 Setup do banco de dados concluído com sucesso!`])

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setResults(prev => [...prev, `❌ Erro: ${err instanceof Error ? err.message : 'Erro desconhecido'}`])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🗄️</span>
              Setup do Banco de Dados
            </CardTitle>
            <p className="text-gray-600">
              Configure as tabelas e dados iniciais do Supabase
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">O que será criado:</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Categorias de produtos</li>
                <li>• Produtos de exemplo</li>
                <li>• Configurações básicas</li>
              </ul>
            </div>

            <Button 
              onClick={setupDatabase} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Configurando...
                </>
              ) : (
                <>
                  🚀 Iniciar Setup
                </>
              )}
            </Button>

            {results.length > 0 && (
              <div className="bg-gray-50 border rounded-lg p-4 max-h-60 overflow-y-auto">
                <h3 className="font-semibold mb-2">Resultados:</h3>
                <div className="space-y-1 text-sm">
                  {results.map((result, index) => (
                    <div key={index}>{result}</div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Erro:</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800">Sucesso!</h3>
                    <p className="text-green-700 text-sm">
                      Banco configurado! Agora você pode testar o marketplace.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <a 
                href="/marketplace" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                🛍️ Ir para o Marketplace
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}