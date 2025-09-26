'use client'

import { useApp } from '@/lib/store'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star, Heart, Plus, Minus, Shield, Truck, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { state, dispatch } = useApp()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const productId = params.id as string
  const product = state.products.find(p => p.id === productId)
  const isFavorite = state.favorites.includes(productId)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
          <Link 
            href="/marketplace" 
            className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Voltar ao Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: product })
    }
    
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const handleToggleFavorite = () => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: product.id })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="text-gray-600 hover:text-orange-500 transition-colors"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 line-clamp-1">{product.name}</h1>
              <p className="text-sm text-gray-600">Por: {product.seller}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-96 relative overflow-hidden">
              {product.badge && (
                <span className={`absolute top-4 left-4 ${product.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold z-10`}>
                  {product.badge}
                </span>
              )}
              
              <button
                onClick={handleToggleFavorite}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-200 z-10 ${
                  isFavorite 
                    ? 'bg-red-500 text-white transform scale-110' 
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                }`}
                data-testid="favorite-btn"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              {product.sellerBadge && (
                <span className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-full text-sm font-medium shadow-md">
                  {product.sellerBadge}
                </span>
              )}
            </div>
            
            {/* Thumbnail gallery - placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-20 cursor-pointer hover:opacity-80 transition-opacity"></div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                {product.location && (
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    📍 {product.location}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < product.rating ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} avaliações)</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b py-6">
              {product.oldPrice && (
                <div className="text-lg text-gray-500 line-through mb-1">
                  R$ {product.oldPrice.toFixed(2)}
                </div>
              )}
              <div className="text-4xl font-bold text-orange-500 mb-2">
                R$ {product.price.toFixed(2)}
              </div>
              {product.oldPrice && (
                <div className="text-green-600 font-medium">
                  Economia de R$ {(product.oldPrice - product.price).toFixed(2)} 
                  ({Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF)
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Quantidade:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                    data-testid="decrease-quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 font-medium min-w-[50px] text-center" data-testid="quantity-display">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    data-testid="increase-quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-lg ${
                    !product.inStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isAdding
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white hover:opacity-90'
                  }`}
                  data-testid="add-to-cart-btn"
                >
                  {isAdding ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adicionado ao Carrinho!
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                    </>
                  )}
                </button>
                
                <Link
                  href="/carrinho"
                  className="px-6 py-4 border-2 border-orange-400 text-orange-400 rounded-xl font-semibold hover:bg-orange-50 transition-colors text-center"
                  data-testid="go-to-cart-btn"
                >
                  Ver Carrinho
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Truck className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-medium text-gray-800">Entrega Grátis</div>
                  <div className="text-sm text-gray-600">Para sua região</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-800">Compra Segura</div>
                  <div className="text-sm text-gray-600">100% protegida</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-800">Suporte Local</div>
                  <div className="text-sm text-gray-600">Direto com vendedor</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Descrição do Produto</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'Descrição completa do produto em breve. Entre em contato com o vendedor para mais informações.'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Avaliações dos Clientes</h2>
              
              <div className="space-y-4">
                {/* Rating Summary */}
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="text-4xl font-bold text-orange-500">{product.rating.toFixed(1)}</div>
                  <div>
                    <div className="flex text-yellow-400 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < product.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <div className="text-gray-600">{product.reviews} avaliações</div>
                  </div>
                </div>

                {/* Sample Reviews */}
                {[
                  { name: 'Ana M.', rating: 5, comment: 'Produto excelente! Superou minhas expectativas.', date: '2 dias atrás' },
                  { name: 'Carlos S.', rating: 5, comment: 'Atendimento impecável e produto de qualidade.', date: '1 semana atrás' },
                  { name: 'Maria L.', rating: 4, comment: 'Muito bom, recomendo!', date: '2 semanas atrás' }
                ].map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-800">{review.name}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Sobre o Vendedor</h2>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                  {product.seller.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{product.seller}</div>
                  <div className="text-sm text-gray-600">Vendedor verificado</div>
                </div>
              </div>

              {product.sellerBadge && (
                <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-3 mb-4">
                  <div className="text-sm font-medium text-gray-800">{product.sellerBadge}</div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Produtos vendidos:</span>
                  <span className="font-medium">250+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avaliação média:</span>
                  <span className="font-medium flex items-center gap-1">
                    {product.rating} <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tempo de resposta:</span>
                  <span className="font-medium">2-4 horas</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-3">
                💬 Conversar com Vendedor
              </button>
              
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                🏪 Ver Loja Completa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
