import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Product as SupabaseProduct, Category } from '@/types/database.types'

// Extended product type for the app
export interface Product extends Omit<SupabaseProduct, 'images' | 'price'> {
  price: number
  images: string[]
  reviews: number
  badge?: string
  badgeColor?: string
  sellerBadge?: string
  location?: string
  inStock: boolean
  oldPrice?: number
  seller_name?: string
  category_name?: string
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (productsError) throw productsError

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (categoriesError) throw categoriesError

      // Transform products data
      const transformedProducts = productsData.map((product: any): Product => ({
        ...product,
        price: parseFloat(product.price),
        images: product.images || [],
        reviews: product.rating_count || 0,
        inStock: product.stock > 0,
        seller_name: product.seller_name || 'Vendedor',
        category_name: product.category?.name || 'Categoria',
        badge: product.stock < 10 && product.stock > 0 ? 'Últimas unidades' : undefined,
        badgeColor: product.stock < 10 && product.stock > 0 ? 'bg-red-500' : undefined
      }))

      setProducts(transformedProducts)
      setCategories(categoriesData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const refetch = () => {
    fetchProducts()
  }

  return {
    products,
    categories,
    loading,
    error,
    refetch
  }
}