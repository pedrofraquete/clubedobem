'use client'

import Link from 'next/link'
import { ArrowLeft, Package, Send } from 'lucide-react'
import UnifiedHeader from '@/components/UnifiedHeader'

export default function CorreiosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader variant="main" />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Correios</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Serviços dos Correios
          </h2>
          <p className="text-xl text-gray-600">
            Acesse rapidamente os serviços de rastreamento e envio de produtos
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Rastreios Card */}
          <Link
            href="/correios/rastreio"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">RASTREIOS</h3>
              <p className="text-gray-600 mb-6">
                Acompanhe suas encomendas em tempo real e receba atualizações sobre o status de entrega
              </p>
              <div className="inline-flex items-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
                Acessar Rastreios
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Postair Card */}
          <Link
            href="/correios/postair"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Send className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">POSTAIR</h3>
              <p className="text-gray-600 mb-6">
                Acesse a plataforma completa dos Correios para envios, cálculo de fretes e mais serviços
              </p>
              <div className="inline-flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                Acessar Postair
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-orange-50 to-teal-50 rounded-2xl p-8 mt-12">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Dica</h3>
            <p className="text-gray-600">
              Para uma melhor experiência, mantenha o código de rastreamento sempre à mão. 
              Os serviços são fornecidos diretamente pelo site oficial dos Correios.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}