'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect, createElement } from 'react'
import { Product, CartItem, Filters, AppState, Action } from './types'

// Initial state
const initialState: AppState = {
  cart: [],
  favorites: [],
  filters: {
    categories: [],
    priceRange: { min: 0, max: 1000 },
    locations: [],
    minRating: 0,
    searchTerm: '',
    sortBy: 'relevance'
  },
  products: [
    {
      id: 1,
      name: 'Kit Marmitas Fitness Semanal - 14 Refeições',
      category: 'Alimentação',
      seller: 'Maria Silva',
      price: 238.00,
      oldPrice: 280.00,
      rating: 5,
      reviews: 127,
      badge: 'Novo',
      badgeColor: 'bg-green-500',
      sellerBadge: '⭐ Top Vendedor',
      description: 'Kit completo com 14 marmitas fitness balanceadas, preparadas com ingredientes frescos e selecionados. Ideal para quem busca praticidade e alimentação saudável.',
      location: 'São Paulo - SP',
      inStock: true
    },
    {
      id: 2,
      name: 'Curso Online de Maquiagem Profissional',
      category: 'Beleza',
      seller: 'Studio Belle',
      price: 157.00,
      oldPrice: 197.00,
      rating: 5,
      reviews: 89,
      badge: '-20%',
      badgeColor: 'bg-yellow-500',
      description: 'Curso completo de maquiagem profissional com certificado. Aprenda técnicas avançadas com profissionais experientes.',
      location: 'Rio de Janeiro - RJ',
      inStock: true
    },
    {
      id: 3,
      name: 'Bolsa Ecológica Feita à Mão',
      category: 'Artesanato',
      seller: 'EcoArte Collective',
      price: 89.90,
      rating: 4,
      reviews: 45,
      sellerBadge: '💚 Sustentável',
      description: 'Bolsa artesanal feita com materiais reciclados e sustentáveis. Cada peça é única e contribui para o meio ambiente.',
      location: 'Belo Horizonte - MG',
      inStock: true
    },
    {
      id: 4,
      name: 'Aula de Violão - Pacote Mensal',
      category: 'Serviços',
      seller: 'João Music',
      price: 120.00,
      rating: 5,
      reviews: 203,
      badge: 'Popular',
      badgeColor: 'bg-blue-500',
      description: 'Aulas de violão personalizadas com método exclusivo. Para iniciantes e intermediários.',
      location: 'Salvador - BA',
      inStock: true
    },
    {
      id: 5,
      name: 'Camiseta Personalizada - Clube do Bem',
      category: 'Moda',
      seller: 'Fashion Local',
      price: 45.00,
      rating: 4,
      reviews: 67,
      badge: 'Últimas unidades',
      badgeColor: 'bg-red-500',
      description: 'Camiseta de algodão 100% com estampa exclusiva. Parte da renda é destinada a projetos sociais.',
      location: 'Fortaleza - CE',
      inStock: true
    },
    {
      id: 6,
      name: 'Consulta Online com Nutricionista',
      category: 'Saúde',
      seller: 'Dra. Ana Santos',
      price: 97.00,
      oldPrice: 150.00,
      rating: 5,
      reviews: 156,
      sellerBadge: '🏆 Mais vendido',
      description: 'Consulta nutricional personalizada via videochamada. Inclui plano alimentar customizado.',
      location: 'Brasília - DF',
      inStock: true
    }
  ]
}

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      }

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.id)
        }
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }

    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      }

    case 'TOGGLE_FAVORITE':
      const isFavorite = state.favorites.includes(action.payload)
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      }

    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      }

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters
      }

    case 'LOAD_STATE':
      return action.payload

    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | null>(null)

// Provider using createElement instead of JSX
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('marketplace-cart')
    const savedFavorites = localStorage.getItem('marketplace-favorites')
    
    if (savedCart || savedFavorites) {
      dispatch({
        type: 'LOAD_STATE',
        payload: {
          ...state,
          cart: savedCart ? JSON.parse(savedCart) : [],
          favorites: savedFavorites ? JSON.parse(savedFavorites) : []
        }
      })
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('marketplace-cart', JSON.stringify(state.cart))
  }, [state.cart])

  useEffect(() => {
    localStorage.setItem('marketplace-favorites', JSON.stringify(state.favorites))
  }, [state.favorites])

  return createElement(AppContext.Provider, { value: { state, dispatch } }, children)
}

// Hook
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

// Utility functions
export function getFilteredProducts(products: Product[], filters: Filters): Product[] {
  let filtered = [...products]

  // Search term
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.seller.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  }

  // Categories
  if (filters.categories.length > 0) {
    filtered = filtered.filter(product =>
      filters.categories.includes(product.category)
    )
  }

  // Price range
  filtered = filtered.filter(product =>
    product.price >= filters.priceRange.min &&
    product.price <= filters.priceRange.max
  )

  // Location
  if (filters.locations.length > 0) {
    filtered = filtered.filter(product =>
      product.location && filters.locations.some(loc =>
        product.location!.toLowerCase().includes(loc.toLowerCase())
      )
    )
  }

  // Rating
  filtered = filtered.filter(product => product.rating >= filters.minRating)

  // Sort
  switch (filters.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'reviews':
      filtered.sort((a, b) => b.reviews - a.reviews)
      break
    default:
      // Keep original order for relevance
      break
  }

  return filtered
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export function getCartItemCount(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.quantity, 0)
}