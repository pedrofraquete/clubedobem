'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, Plus, Minus, MapPin, Shield, Truck } from 'lucide-react'
import ProductGallery from './ProductGallery'

interface ProductDetailProps {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariation, setSelectedVariation] = useState('M')
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock product data - in real app, fetch based on productId
  const product = {
    id: productId,
    name: 'Kit Marmitas Fitness Semanal - 14 Refeições Balanceadas',
    category: 'Alimentação',
    seller: {
      name: 'Maria Silva',
      rating: 4.9,
      sales: 1247,
      location: 'Vila Madalena, SP',
      badge: '⭐ Top Vendedor',
      avatar: '',
      description: 'Nutricionista especializada em alimentação saudável há 8 anos'
    },
    price: 238.00,
    oldPrice: 280.00,
    rating: 4.8,
    reviews: 127,
    sold: 89,
    stock: 15,
    description: `Kit completo com 14 marmitas fitness balanceadas, preparadas com ingredientes frescos e selecionados. 
    
Cada marmita contém:
• Proteína magra (frango, peixe ou carne vermelha)
• Carboidrato complexo (arroz integral, batata doce ou quinoa)
• Vegetais frescos e variados
• Temperos naturais sem conservantes

Ideal para quem busca praticidade sem abrir mão da qualidade nutricional. Todas as refeições são preparadas no dia da entrega para garantir máximo frescor.`,
    variations: [
      { name: 'Tamanho', options: ['P (300g)', 'M (400g)', 'G (500g)'] },
      { name: 'Tipo', options: ['Tradicional', 'Low Carb', 'Vegetariano'] }
    ],
    features: [
      '✓ Ingredientes frescos e orgânicos',
      '✓ Preparado no dia da entrega',
      '✓ Embalagem sustentável',
      '✓ Informações nutricionais completas',
      '✓ Sem conservantes artificiais'
    ],
    delivery: {
      time: '2-3 dias úteis',
      cost: 'Grátis acima de R$ 150',
      area: 'Região metropolitana de SP'
    }
  }

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Added to cart:', { productId, quantity, variation: selectedVariation })
  }

  const handleBuyNow = () => {
    // Direct checkout logic
    console.log('Buy now:', { productId, quantity, variation: selectedVariation })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/marketplace"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar ao Marketplace</span>
            </Link>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>/</span>
              <Link href="/marketplace" className="hover:text-orange-400">Marketplace</Link>
              <span>/</span>
              <span className="text-gray-800">{product.category}</span>
              <span>/</span>
              <span className="text-gray-800 truncate max-w-xs">{product.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Gallery */}
          <div>
            <ProductGallery productId={productId} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.seller.badge}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating and Sales */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviews} avaliações)
                  </span>
                </div>
                <div className="text-gray-600">
                  {product.sold} vendidos
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                {product.oldPrice && (
                  <div className="text-lg text-gray-500 line-through mb-1">
                    R$ {product.oldPrice.toFixed(2)}
                  </div>
                )}
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  R$ {product.price.toFixed(2)}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Economia de R$ {((product.oldPrice || 0) - product.price).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Variations */}
            <div className="space-y-4">
              {product.variations.map((variation, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {variation.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variation.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedVariation(option)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          selectedVariation === option
                            ? 'border-orange-400 bg-orange-50 text-orange-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock} disponíveis
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Comprar Agora
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-orange-400 text-orange-400 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Adicionar ao Carrinho
                </button>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-colors ${
                    isFavorite
                      ? 'border-red-400 text-red-400 bg-red-50'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
                </button>
                
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-600 hover:border-gray-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-800 mb-3">Informações de Entrega</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span>Entrega em {product.delivery.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{product.delivery.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span>{product.delivery.cost}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button className="px-6 py-4 text-orange-400 border-b-2 border-orange-400 font-medium">
                  Descrição
                </button>
                <button className="px-6 py-4 text-gray-600 hover:text-gray-800 transition-colors">
                  Avaliações ({product.reviews})
                </button>
                <button className="px-6 py-4 text-gray-600 hover:text-gray-800 transition-colors">
                  Vendedor
                </button>
              </nav>
            </div>
            
            <div className="p-8">
              {/* Description Tab */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Sobre o Produto</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Características</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        {/* <SellerInfo seller={product.seller} /> */}

        {/* Reviews */}
        {/* <ProductReviews productId={productId} rating={product.rating} reviewCount={product.reviews} /> */}

        {/* Related Products */}
        {/* <RelatedProducts currentProductId={productId} category={product.category} /> */}
      </div>
    </div>
  )
}