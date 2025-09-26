'use client'

import { useState } from 'react'
import Link from 'next/link' 
import { ArrowLeft, Star, Plus, Heart, ShoppingCart } from 'lucide-react'
import { useSimpleStore, sampleProducts } from '@/lib/simple-store'

export default function SimpleMarketplacePage() {
  const { cart, favorites, addToCart, toggleFavorite, getCartItemCount } = useSimpleStore()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter products based on search
  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <h1 className="text-2xl font-bold text-gray-800">Marketplace Social</h1>
            </div>
            
            {/* Cart Icon */}
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
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
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
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
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary (if has items) */}
        {cart.length > 0 && (
          <div className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold mb-2">🛒 Seu Carrinho</h3>
            <p className="mb-4">
              {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'itens'} no carrinho
            </p>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>R$ {cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}