'use client'

import { Star, Plus, Heart } from 'lucide-react'
import { useApp } from '@/lib/simple-store'
import { Product } from '@/lib/types'
import Link from 'next/link'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { state, dispatch } = useApp()
  const [isAdding, setIsAdding] = useState(false)
  const isFavorite = state.favorites.includes(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking add to cart
    setIsAdding(true)
    
    dispatch({ type: 'ADD_TO_CART', payload: product })
    
    // Add visual feedback
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking favorite
    dispatch({ type: 'TOGGLE_FAVORITE', payload: product.id })
  }

  return (
    <Link href={`/marketplace/produto/${product.id}`} className="group">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Product Image */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
          {product.badge && (
            <span className={`absolute top-3 left-3 ${product.badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold z-10`}>
              {product.badge}
            </span>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
              isFavorite 
                ? 'bg-red-500 text-white transform scale-110' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
            data-testid={`favorite-btn-${product.id}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          {product.sellerBadge && (
            <span className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              {product.sellerBadge}
            </span>
          )}
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold">
                Esgotado
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="text-sm text-blue-600 font-medium mb-2">{product.category}</div>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          <div className="text-sm text-gray-600 mb-3">Por: {product.seller}</div>
          
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
          <div className="flex items-center justify-between mt-auto">
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
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 text-sm ${
                !product.inStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isAdding
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white hover:scale-105'
              }`}
              data-testid={`add-to-cart-btn-${product.id}`}
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adicionado!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {product.inStock ? 'Carrinho' : 'Esgotado'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
