'use client'

import { useApp } from '@/lib/store'
import { ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/marketplace/ProductCard'
import UnifiedHeader from '@/components/UnifiedHeader'

export default function FavoritosPage() {
  const { state } = useApp()
  const favoriteProducts = state.products.filter(product => 
    state.favorites.includes(product.id)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader variant="marketplace" />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <h1 className="text-2xl font-bold text-gray-800">Meus Favoritos</h1>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favoriteProducts.length === 0 ? (
          // Empty Favorites
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nenhum favorito ainda</h2>
            <p className="text-gray-600 mb-8">
              Explore nosso marketplace e adicione produtos aos seus favoritos clicando no ❤️
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
              data-testid="browse-products-btn"
            >
              <Heart className="w-5 h-5" />
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header with actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Seus Produtos Favoritos</h2>
                  <p className="text-gray-600 mt-1">
                    Acompanhe os produtos que você mais gosta e não perca as promoções
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      if (confirm('Tem certeza que deseja remover todos os favoritos?')) {
                        favoriteProducts.forEach(product => {
                          const { dispatch } = useApp()
                          dispatch({ type: 'TOGGLE_FAVORITE', payload: product.id })
                        })
                      }
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                    data-testid="clear-favorites-btn"
                  >
                    Limpar Favoritos
                  </button>
                  
                  <Link
                    href="/marketplace"
                    className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
                    data-testid="continue-browsing-btn"
                  >
                    Continuar Navegando
                  </Link>
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="favorites-grid">
                {favoriteProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">💡 Dica Especial</h2>
              <p className="text-lg mb-6">
                Produtos favoritos podem ter promoções exclusivas! Fique de olho.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                  <div className="text-2xl font-bold">🔔</div>
                  <div className="text-sm mt-2">Notificações de preço</div>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                  <div className="text-2xl font-bold">⚡</div>
                  <div className="text-sm mt-2">Ofertas relâmpago</div>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                  <div className="text-2xl font-bold">🎁</div>
                  <div className="text-sm mt-2">Descontos exclusivos</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
