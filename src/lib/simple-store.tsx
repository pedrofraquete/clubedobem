'use client'

import { createContext, useContext, ReactNode } from 'react'

// Tipos básicos
interface Product {
  id: string
  name: string
  category: string
  seller: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  badge?: string
  badgeColor?: string
  sellerBadge?: string
  description?: string
  images?: string[]
  location?: string
  inStock?: boolean
}

interface CartItem extends Product {
  quantity: number
}

interface Filters {
  categories: string[]
  priceRange: { min: number; max: number }
  locations: string[]
  minRating: number
  searchTerm: string
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'reviews'
}

// Contexto simples apenas para evitar erros
const SimpleAppContext = createContext<{} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SimpleAppContext.Provider value={{}}>
      {children}
    </SimpleAppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(SimpleAppContext)
  // Retorna um objeto mock para evitar erros
  return {
    state: {
      cart: [] as CartItem[],
      favorites: [] as string[],
      filters: {
        categories: [],
        priceRange: { min: 0, max: 1000 },
        locations: [],
        minRating: 0,
        searchTerm: '',
        sortBy: 'relevance' as const
      },
      products: [] as Product[]
    },
    dispatch: () => {}
  }
}

// Funções utilitárias mock
export function getFilteredProducts(products: Product[], filters: Filters): Product[] {
  return products || []
}

export function getCartTotal(cart: CartItem[]): number {
  return cart?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0
}

export function getCartItemCount(cart: CartItem[]): number {
  return cart?.reduce((total, item) => total + item.quantity, 0) || 0
}
