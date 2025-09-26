'use client'

import { useState } from 'react'
import Link from 'next/link' 
import { ArrowLeft, Star, Plus, Heart, ShoppingCart } from 'lucide-react'

// Sample products
const sampleProducts = [
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
    location: 'São Paulo - SP'
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
    badgeColor: 'bg-yellow-500',
    location: 'Rio de Janeiro - RJ'
  },
  {
    id: 3,
    name: 'Bolsa Ecológica Feita à Mão',
    category: 'Artesanato',
    seller: 'EcoArte Collective',
    price: 89.90,
    rating: 4,
    reviews: 45,
    location: 'Belo Horizonte - MG'
  }
]

export default function MarketplaceTestPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cartItems, setCartItems] = useState<number[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  
  // Filter products based on search
  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (productId: number) => {
    setCartItems(prev => [...prev, productId])
  }

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Marketplace Social - Teste</h1>
            </div>
            
            {/* Cart Icon */}
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Produtos ({filteredProducts.length})
          </h2>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600">Tente buscar por outros termos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    {product.badge && (
                      <span className={`absolute top-3 left-3 ${product.badgeColor} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                        {product.badge}
                      </span>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                        favorites.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="text-sm text-blue-600 font-medium mb-1">{product.category}</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <div className="text-sm text-gray-600 mb-2">Por: {product.seller}</div>
                    
                    {product.location && (
                      <div className="text-xs text-gray-500 mb-3">📍 {product.location}</div>
                    )}
                    
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
                        <div className="text-lg font-bold text-orange-500">
                          R$ {product.price.toFixed(2)}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Info */}
        <div className="bg-blue-50 rounded-lg p-4 mt-6">
          <h3 className="font-bold text-blue-800 mb-2">🧪 Status do Teste:</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <div>• Carrinho: {cartItems.length} itens</div>
            <div>• Favoritos: {favorites.length} produtos</div>
            <div>• Busca funcionando: {searchTerm ? `"${searchTerm}"` : 'Digite para testar'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}