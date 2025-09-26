'use client'

import { useState } from 'react'
import { Search, User, Store, ShoppingCart, Menu, X } from 'lucide-react'
import Link from 'next/link'
import CartIcon from './CartIcon'

export default function MarketplaceHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showVendorModal, setShowVendorModal] = useState(false)

  const categories = [
    { icon: '🏠', label: 'Todos', active: true },
    { icon: '🍔', label: 'Alimentação' },
    { icon: '👕', label: 'Moda' },
    { icon: '💄', label: 'Beleza' },
    { icon: '🎓', label: 'Cursos' },
    { icon: '🔧', label: 'Serviços' },
    { icon: '🏥', label: 'Saúde' },
    { icon: '🎨', label: 'Artesanato' },
    { icon: '🌱', label: 'Sustentável' }
  ]

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        {/* Header Top Banner */}
        <div className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white py-2 text-center text-sm">
          🎉 Cada compra transforma vidas! Parte do valor vai para projetos sociais da sua comunidade
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <span className="text-3xl bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 bg-clip-text text-transparent">
                ∞
              </span>
              <span>Marketplace do Bem</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos, serviços ou vendedores..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-full focus:border-orange-400 focus:outline-none"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-400 text-white p-2 rounded-full hover:bg-orange-500 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Header Actions */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex flex-col items-center gap-1 text-gray-700 hover:text-orange-400 transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="text-xs">Entrar</span>
              </button>
              
              <button
                onClick={() => setShowVendorModal(true)}
                className="flex flex-col items-center gap-1 text-gray-700 hover:text-orange-400 transition-colors"
              >
                <Store className="w-6 h-6" />
                <span className="text-xs">Vender</span>
              </button>
              
              <Link href="/favoritos" className="flex flex-col items-center gap-1 text-gray-700 hover:text-orange-400 transition-colors">
                <Heart className="w-6 h-6" />
                <span className="text-xs">Favoritos</span>
              </Link>
              
              <CartIcon />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <User className="w-5 h-5" />
                  <span>Entrar</span>
                </button>
                <button
                  onClick={() => setShowVendorModal(true)}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <Store className="w-5 h-5" />
                  <span>Vender</span>
                </button>
                <div className="flex items-center gap-3 text-gray-700">
                  <CartIcon />
                  <span>Carrinho</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Categories Navigation */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-6 overflow-x-auto">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    category.active
                      ? 'bg-orange-400 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Entrar ou Cadastrar</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Entrar
              </button>
              <div className="text-center text-gray-500">ou</div>
              <button
                type="button"
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Criar Conta
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Modal */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Começar a Vender</h2>
              <button
                onClick={() => setShowVendorModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Negócio
                </label>
                <input
                  type="text"
                  placeholder="Ex: Doces da Maria"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria Principal
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent">
                  <option>Selecione uma categoria</option>
                  <option>Alimentação</option>
                  <option>Moda</option>
                  <option>Beleza</option>
                  <option>Serviços</option>
                  <option>Artesanato</option>
                  <option>Saúde</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone/WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="vendedor@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conte sobre seu negócio
                </label>
                <textarea
                  rows={3}
                  placeholder="O que você vende? Qual sua história?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Enviar Solicitação
              </button>
              <p className="text-xs text-gray-600 text-center">
                Ao se cadastrar, você concorda com nossa política de split de pagamentos: 
                85% para você, 15% para projetos sociais.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}