'use client'

import { useState } from 'react'
import { Star, Plus } from 'lucide-react'

export default function ProductGrid() {
  const [cartCount, setCartCount] = useState(3)

  const products = [
    {
      id: 1,
      name: 'Kit Marmitas Fitness Semanal - 14 Refeições',
      category: 'Alimentação',
      seller: 'Maria Silva',
      price: 238.00,
      oldPrice: 280.00,
      rating: 5,
      reviews: 127,
      badge: 'Novo',
      badgeColor: 'bg-green-500',
      sellerBadge: '⭐ Top Vendedor'
    },
    {
      id: 2,
      name: 'Curso Online de Maquiagem Profissional',
      category: 'Beleza',
      seller: 'Studio Belle',
      price: 157.00,
      oldPrice: 197.00,
      rating: 5,
      reviews: 89,
      badge: '-20%',
      badgeColor: 'bg-yellow-500'
    },
    {
      id: 3,
      name: 'Bolsa Ecológica Feita à Mão',
      category: 'Artesanato',
      seller: 'EcoArte Collective',
      price: 89.90,
      rating: 4,
      reviews: 45,
      sellerBadge: '💚 Sustentável'
    },
    {
      id: 4,
      name: 'Aula de Violão - Pacote Mensal',
      category: 'Serviços',
      seller: 'João Music',
      price: 120.00,
      rating: 5,
      reviews: 203,
      badge: 'Popular',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 5,
      name: 'Camiseta Personalizada - Clube do Bem',
      category: 'Moda',
      seller: 'Fashion Local',
      price: 45.00,
      rating: 4,
      reviews: 67,
      badge: 'Últimas unidades',
      badgeColor: 'bg-red-500'
    },
    {
      id: 6,
      name: 'Consulta Online com Nutricionista',
      category: 'Saúde',
      seller: 'Dra. Ana Santos',
      price: 97.00,
      oldPrice: 150.00,
      rating: 5,
      reviews: 156,
      sellerBadge: '🏆 Mais vendido'
    }
  ]

  const handleAddToCart = (productId: number) => {
    setCartCount(prev => prev + 1)
    // Add visual feedback
    const button = document.querySelector(`[data-product-id="${productId}"]`)
    if (button) {
      const originalText = button.textContent
      button.textContent = '✓ Adicionado'
      button.classList.add('bg-green-500')
      setTimeout(() => {
        button.textContent = originalText
        button.classList.remove('bg-green-500')
      }, 2000)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Filtros</h3>
            
            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Categorias</h4>
              <div className="space-y-2">
                {['Alimentação (234)', 'Moda (567)', 'Beleza (189)', 'Serviços (423)'].map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-orange-400 focus:ring-orange-400" />
                    <span className="text-sm text-gray-600">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Preço</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Localização</h4>
              <div className="space-y-2">
                {['Minha região', 'Até 5km', 'Até 10km'].map((location) => (
                  <label key={location} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-orange-400 focus:ring-orange-400" />
                    <span className="text-sm text-gray-600">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Avaliação</h4>
              <div className="space-y-2">
                {[
                  { stars: '⭐⭐⭐⭐⭐', label: '(5)' },
                  { stars: '⭐⭐⭐⭐', label: '(4+)' },
                  { stars: '⭐⭐⭐', label: '(3+)' }
                ].map((rating) => (
                  <label key={rating.label} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-orange-400 focus:ring-orange-400" />
                    <span className="text-sm text-gray-600">{rating.stars} {rating.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Aplicar Filtros
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Section Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Produtos em Destaque</h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent">
                <option>Mais Relevantes</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Mais Vendidos</option>
                <option>Melhor Avaliados</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    {product.badge && (
                      <span className={`absolute top-3 left-3 ${product.badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                        {product.badge}
                      </span>
                    )}
                    {product.sellerBadge && (
                      <span className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                        {product.sellerBadge}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="text-sm text-blue-600 font-medium mb-2">{product.category}</div>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="text-sm text-gray-600 mb-3">Por: {product.seller}</div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < product.rating ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div>
                        {product.oldPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            R$ {product.oldPrice.toFixed(2)}
                          </div>
                        )}
                        <div className="text-xl font-bold text-orange-500">
                          R$ {product.price.toFixed(2)}
                        </div>
                      </div>
                      <button
                        data-product-id={product.id}
                        onClick={() => handleAddToCart(product.id)}
                        className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-4 py-2 rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
        </main>
      </div>
    </div>
  )
}