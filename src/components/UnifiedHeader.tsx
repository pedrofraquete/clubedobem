'use client'

import { useState } from 'react'
import { Menu, X, Search, Store, Heart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserNav from './UserNav'
import CartIcon from './marketplace/CartIcon'
import { useAuth } from '@/contexts/AuthContext'

interface UnifiedHeaderProps {
  variant?: 'main' | 'marketplace'
}

export default function UnifiedHeader({ variant = 'main' }: UnifiedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showVendorModal, setShowVendorModal] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  
  const isMarketplace = variant === 'marketplace' || pathname.includes('/marketplace') || pathname.includes('/carrinho') || pathname.includes('/favoritos')

  const scrollToSection = (sectionId: string) => {
    // If we're on marketplace, go to home first
    if (isMarketplace && !pathname.startsWith('/')) {
      window.location.href = `/#${sectionId}`
      return
    }
    
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

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
      <nav className={`${isMarketplace ? 'sticky top-0' : 'fixed w-full top-0'} bg-white/95 backdrop-blur-md z-50 shadow-lg`}>
        {/* Header Top Banner - Only on marketplace */}
        {isMarketplace && (
          <div className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white py-2 text-center text-sm">
            🎉 Cada compra transforma vidas! Parte do valor vai para projetos sociais da sua comunidade
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link href={isMarketplace ? "/marketplace" : "/"} className="flex items-center cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 bg-clip-text text-transparent">
                  ∞
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-bold text-gray-600">
                    {isMarketplace ? 'Marketplace do Bem' : 'Clube do Bem'}
                  </span>
                  <span className="text-xs font-normal text-gray-600 tracking-[4px]">BRASIL</span>
                </div>
              </div>
            </Link>

            {/* Search Bar - Only on marketplace */}
            {isMarketplace && (
              <div className="flex-1 max-w-2xl mx-4 hidden md:block">
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
            )}

            {/* Navigation - Main site */}
            {!isMarketplace && (
              <ul className="hidden md:flex gap-8 list-none">
                {[
                  { label: 'Início', id: 'home' },
                  { label: 'Impacto', id: 'impact' },
                  { label: 'MultiMais', id: 'multimais' },
                  { label: 'Parceiros', id: 'partners' },
                  { label: 'Agendamento', id: 'agendamento' }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-700 font-medium hover:text-orange-400 transition-colors relative group"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>
                ))}
                <li>
                  <Link
                    href="/correios"
                    className="text-gray-700 font-medium hover:text-orange-400 transition-colors relative group"
                  >
                    Correios
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketplace"
                    className="text-gray-700 font-medium hover:text-orange-400 transition-colors relative group"
                  >
                    Marketplace
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              </ul>
            )}

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Marketplace specific actions */}
              {isMarketplace && (
                <>
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
                </>
              )}
              
              {/* Unified User Navigation */}
              <UserNav />
              
              {/* CTA Button - Main site only */}
              {!isMarketplace && (
                <button
                  onClick={() => scrollToSection('partners')}
                  className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-6 py-3 rounded-full font-semibold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  Faça Parte
                </button>
              )}
            </div>

            {/* Mobile Menu Button and User Nav */}
            <div className="md:hidden flex items-center gap-2">
              {isMarketplace && <CartIcon />}
              <UserNav />
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search - Marketplace only */}
          {isMarketplace && (
            <div className="md:hidden pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-full focus:border-orange-400 focus:outline-none"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-400 text-white p-2 rounded-full hover:bg-orange-500 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
              <div className="flex flex-col p-4 space-y-4">
                {!isMarketplace ? (
                  // Main site navigation
                  <>
                    {[
                      { label: 'Início', id: 'home' },
                      { label: 'Impacto', id: 'impact' },
                      { label: 'MultiMais', id: 'multimais' },
                      { label: 'Parceiros', id: 'partners' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="text-left text-gray-700 font-medium hover:text-orange-400 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                    <Link
                      href="/correios"
                      className="text-left text-gray-700 font-medium hover:text-orange-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Correios
                    </Link>
                    <Link
                      href="/marketplace"
                      className="text-left text-gray-700 font-medium hover:text-orange-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Marketplace
                    </Link>
                  </>
                ) : (
                  // Marketplace navigation
                  <>
                    <Link
                      href="/"
                      className="text-left text-gray-700 font-medium hover:text-orange-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Página Inicial
                    </Link>
                    <button
                      onClick={() => setShowVendorModal(true)}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <Store className="w-5 h-5" />
                      <span>Vender</span>
                    </button>
                    <Link 
                      href="/favoritos" 
                      className="flex items-center gap-3 text-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="w-5 h-5" />
                      <span>Favoritos</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Categories Navigation - Marketplace only */}
        {isMarketplace && (
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
        )}
      </nav>

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