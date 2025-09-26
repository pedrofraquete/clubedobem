'use client'

import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export default function PostairPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/correios" className="text-gray-600 hover:text-teal-600 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <Send className="w-6 h-6 text-teal-500" />
            <h1 className="text-2xl font-bold text-gray-800">Postair - Plataforma dos Correios</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-teal-400 to-teal-600">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Postair - Correios
              </h2>
              <p className="text-teal-100">
                Plataforma completa para envios, cálculo de fretes e serviços postais
              </p>
            </div>
          </div>
          
          {/* Iframe Container */}
          <div className="relative">
            <iframe 
              src="https://www.postair.com.br"
              style={{
                width: '100%',
                height: '800px',
                border: 'none'
              }}
              title="Plataforma Postair dos Correios"
              loading="lazy"
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">
              📦 Plataforma oficial dos Correios • Envios, cálculos e serviços completos
            </p>
            <div className="mt-2">
              <Link
                href="/correios"
                className="text-teal-600 hover:text-teal-700 transition-colors text-sm font-medium"
              >
                ← Voltar aos Serviços dos Correios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}