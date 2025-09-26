'use client'

import { useProducts } from '@/hooks/useProducts'
import { useApp } from '@/lib/store'
import ProductCard from './ProductCard'
import { Loader2 } from 'lucide-react'

export default function SupabaseProductGrid() {
  const { products, loading, error } = useProducts()
  const { state, dispatch } = useApp()
  
  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Search term
    if (state.filters.searchTerm) {
      const term = state.filters.searchTerm.toLowerCase()
      if (!product.name.toLowerCase().includes(term) &&
          !product.seller_name?.toLowerCase().includes(term) &&
          !product.category_name?.toLowerCase().includes(term)) {
        return false
      }
    }

    // Categories
    if (state.filters.categories.length > 0) {
      if (!state.filters.categories.includes(product.category_name || '')) {
        return false
      }
    }

    // Price range
    if (product.price < state.filters.priceRange.min ||
        product.price > state.filters.priceRange.max) {
      return false
    }

    // Rating
    if (product.rating < state.filters.minRating) {
      return false
    }

    return true
  }).sort((a, b) => {
    // Sort products
    switch (state.filters.sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  const handleResetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando produtos...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl text-red-500">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar produtos</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Produtos em Destaque</h2>
          <p className="text-gray-600 mt-1">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl text-gray-400">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-600 mb-6">
            {products.length === 0 
              ? 'Não há produtos disponíveis no momento'
              : 'Tente ajustar seus filtros ou busque por outros termos'
            }
          </p>
          {products.length > 0 && (
            <button
              onClick={handleResetFilters}
              className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                id: product.id,
                name: product.name,
                category: product.category_name || 'Categoria',
                seller: product.seller_name || 'Vendedor',
                price: product.price,
                oldPrice: product.oldPrice,
                rating: product.rating,
                reviews: product.reviews,
                badge: product.badge,
                badgeColor: product.badgeColor,
                sellerBadge: product.sellerBadge,
                description: product.description || '',
                location: product.location,
                inStock: product.inStock
              }} 
            />
          ))}
        </div>
      )}

      {/* Impact Banner */}
      <div className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white rounded-2xl p-8 mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Seu Impacto na Comunidade</h2>
        <p className="text-lg mb-6">Cada compra gera transformação social real</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { number: 'R$ 45.780', label: 'Repassados aos vendedores' },
            { number: '234', label: 'Famílias beneficiadas' },
            { number: 'R$ 12.340', label: 'Em projetos sociais' },
            { number: '89%', label: 'Renda local' }
          ].map((metric, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
              <div className="text-2xl font-bold">{metric.number}</div>
              <div className="text-sm opacity-90">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}