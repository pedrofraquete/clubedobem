'use client'

import { createContext, useContext, ReactNode } from 'react'

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
  if (!context) {
    // Retorna um objeto vazio em vez de lançar erro
    return {
      state: {
        cart: [],
        favorites: [],
        filters: {
          categories: [],
          priceRange: { min: 0, max: 1000 },
          locations: [],
          minRating: 0,
          searchTerm: '',
          sortBy: 'relevance' as const
        },
        products: []
      },
      dispatch: () => {}
    }
  }
  return context
}
