'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed w-full top-0 bg-white/95 backdrop-blur-md z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 bg-clip-text text-transparent">
                ∞
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-gray-600">Clube do Bem</span>
                <span className="text-xs font-normal text-gray-600 tracking-[4px]">BRASIL</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 list-none">
            {[
              { label: 'Início', id: 'home' },
              { label: 'Impacto', id: 'impact' },
              { label: 'MultiMais', id: 'multimais' },
              { label: 'Parceiros', id: 'partners' }
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

          {/* CTA Button */}
          <button
            onClick={() => scrollToSection('partners')}
            className="hidden md:block bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-6 py-3 rounded-full font-semibold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            Faça Parte
          </button>

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
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <div className="flex flex-col p-4 space-y-4">
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
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}