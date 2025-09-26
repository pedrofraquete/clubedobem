'use client'

import { useApp, getFilteredProducts } from '@/lib/store'
import ProductCard from './ProductCard'

export default function ProductGrid() {
  const { state } = useApp()
  const filteredProducts = getFilteredProducts(state.products, state.filters)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Produtos em Destaque</h2>
          <p className="text-gray-600 mt-1">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl text-gray-400">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-600 mb-6">
            Tente ajustar seus filtros ou busque por outros termos
          </p>
          <button
            onClick={() => {
              const { dispatch } = useApp()
              dispatch({ type: 'RESET_FILTERS' })
            }}
            className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Impact Banner */}
      <div className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white rounded-2xl p-8 mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Seu Impacto na Comunidade</h2>
        <p className="text-lg mb-6">Cada compra gera transformação social real</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { number: 'R$ 45.780', label: 'Repassados aos vendedores' },
            { number: '234', label: 'Famílias beneficiadas' },
            { number: 'R$ 12.340', label: 'Em projetos sociais' },
            { number: '89%', label: 'Renda local' }
          ].map((metric, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
              <div className="text-2xl font-bold">{metric.number}</div>
              <div className="text-sm opacity-90">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}