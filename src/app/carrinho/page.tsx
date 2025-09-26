'use client'

import { useApp, getCartTotal, getCartItemCount } from '@/lib/store'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CarrinhoPage() {
  const { state, dispatch } = useApp()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const total = getCartTotal(state.cart)
  const itemCount = getCartItemCount(state.cart)

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  }

  const handleClearCart = () => {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
      dispatch({ type: 'CLEAR_CART' })
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Pedido realizado com sucesso! Você receberá um email com os detalhes.')
    dispatch({ type: 'CLEAR_CART' })
    setIsCheckingOut(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Meu Carrinho</h1>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.cart.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-8">
              Explore nosso marketplace e descubra produtos incríveis de empreendedores locais!
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
              data-testid="continue-shopping-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Itens do Carrinho</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 text-sm"
                    data-testid="clear-cart-btn"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpar Carrinho
                  </button>
                </div>

                <div className="space-y-4">
                  {state.cart.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0"></div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">Por: {item.seller}</p>
                          <p className="text-sm text-blue-600">{item.category}</p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              data-testid={`decrease-quantity-${item.id}`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium" data-testid={`quantity-${item.id}`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              data-testid={`increase-quantity-${item.id}`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            data-testid={`remove-item-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-500">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            R$ {item.price.toFixed(2)} cada
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
                    <span className="font-medium">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de entrega</span>
                    <span className="font-medium text-green-600">Grátis</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-orange-500" data-testid="cart-total">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    isCheckingOut
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white hover:opacity-90'
                  }`}
                  data-testid="checkout-btn"
                >
                  {isCheckingOut ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processando...
                    </div>
                  ) : (
                    'Finalizar Compra'
                  )}
                </button>

                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">🌟 Seu Impacto Social</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Com esta compra você estará apoiando {state.cart.length} {state.cart.length === 1 ? 'empreendedor local' : 'empreendedores locais'}!
                  </p>
                  <div className="text-xs text-gray-500">
                    • R$ {(total * 0.05).toFixed(2)} destinados a projetos sociais<br/>
                    • R$ {(total * 0.85).toFixed(2)} repassados diretamente aos vendedores
                  </div>
                </div>

                <Link
                  href="/marketplace"
                  className="block text-center text-orange-600 hover:text-orange-700 transition-colors mt-4 font-medium"
                  data-testid="continue-shopping-link"
                >
                  ← Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
