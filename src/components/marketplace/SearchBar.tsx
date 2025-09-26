'use client'

import { Search, Filter } from 'lucide-react'
import { useApp } from '@/lib/store'
import { useState, useEffect } from 'react'

export default function SearchBar() {
  const { state, dispatch } = useApp()
  const [searchTerm, setSearchTerm] = useState(state.filters.searchTerm)
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({
        type: 'UPDATE_FILTERS',
        payload: { searchTerm }
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, dispatch])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos, vendedores ou categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700"
            data-testid="search-input"
          />
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex gap-2">
          <select
            value={state.filters.sortBy}
            onChange={(e) => dispatch({
              type: 'UPDATE_FILTERS',
              payload: { sortBy: e.target.value as any }
            })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
            data-testid="sort-select"
          >
            <option value="relevance">Mais Relevantes</option>
            <option value="price-low">Menor Preço</option>
            <option value="price-high">Maior Preço</option>
            <option value="rating">Melhor Avaliados</option>
            <option value="reviews">Mais Vendidos</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-orange-50 border-orange-300 text-orange-600' : 'bg-white'
            }`}
            data-testid="filter-toggle-btn"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Categories Quick Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {['Alimentação', 'Moda', 'Beleza', 'Serviços', 'Artesanato', 'Saúde'].map((category) => (
                  <label key={category} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={state.filters.categories.includes(category)}
                      onChange={(e) => {
                        const categories = e.target.checked
                          ? [...state.filters.categories, category]
                          : state.filters.categories.filter(c => c !== category)
                        dispatch({ type: 'UPDATE_FILTERS', payload: { categories } })
                      }}
                      className="rounded text-orange-400 focus:ring-orange-400"
                      data-testid={`category-${category.toLowerCase()}-checkbox`}
                    />
                    <span className="text-gray-600">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={state.filters.priceRange.min || ''}
                  onChange={(e) => dispatch({
                    type: 'UPDATE_FILTERS',
                    payload: {
                      priceRange: {
                        ...state.filters.priceRange,
                        min: Number(e.target.value) || 0
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  data-testid="price-min-input"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={state.filters.priceRange.max || ''}
                  onChange={(e) => dispatch({
                    type: 'UPDATE_FILTERS',
                    payload: {
                      priceRange: {
                        ...state.filters.priceRange,
                        max: Number(e.target.value) || 1000
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  data-testid="price-max-input"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação Mínima</label>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="rating"
                      checked={state.filters.minRating === rating}
                      onChange={() => dispatch({
                        type: 'UPDATE_FILTERS',
                        payload: { minRating: rating }
                      })}
                      className="text-orange-400 focus:ring-orange-400"
                      data-testid={`rating-${rating}-radio`}
                    />
                    <span className="text-gray-600">
                      {'⭐'.repeat(rating)} {rating === 1 ? 'ou mais' : `(${rating}+)`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                data-testid="reset-filters-btn"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                data-testid="apply-filters-btn"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(state.filters.categories.length > 0 || state.filters.searchTerm || state.filters.minRating > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {state.filters.searchTerm && (
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              Busca: "{state.filters.searchTerm}"
              <button
                onClick={() => {
                  setSearchTerm('')
                  dispatch({ type: 'UPDATE_FILTERS', payload: { searchTerm: '' } })
                }}
                className="ml-1 hover:text-orange-600"
              >
                ×
              </button>
            </span>
          )}
          {state.filters.categories.map(category => (
            <span key={category} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {category}
              <button
                onClick={() => dispatch({
                  type: 'UPDATE_FILTERS',
                  payload: {
                    categories: state.filters.categories.filter(c => c !== category)
                  }
                })}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          ))}
          {state.filters.minRating > 0 && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {state.filters.minRating}+ estrelas
              <button
                onClick={() => dispatch({ type: 'UPDATE_FILTERS', payload: { minRating: 0 } })}
                className="ml-1 hover:text-yellow-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
