'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// Types
export interface Product {
  id: number
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
  location?: string
  inStock?: boolean
}

export interface CartItem extends Product {
  quantity: number
}

// Sample products
export const sampleProducts: Product[] = [
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
    description: 'Kit completo com 14 marmitas fitness balanceadas.',
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
    description: 'Curso completo de maquiagem profissional.',
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
    description: 'Bolsa artesanal feita com materiais reciclados.',
    location: 'Belo Horizonte - MG',
    inStock: true
  }
]

// Context type
interface StoreContextType {
  cart: CartItem[]
  favorites: number[]
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  toggleFavorite: (id: number) => void
  getCartTotal: () => number
  getCartItemCount: () => number
}

// Context
const StoreContext = createContext<StoreContextType | null>(null)

// Provider component
export function SimpleStoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<number[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('marketplace-cart')
    const savedFavorites = localStorage.getItem('marketplace-favorites')
    
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('marketplace-cart', JSON.stringify(cart))
  }, [cart])

  // Save to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem('marketplace-favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const value: StoreContextType = {
    cart,
    favorites,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleFavorite,
    getCartTotal,
    getCartItemCount
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

// Hook
export function useSimpleStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useSimpleStore must be used within SimpleStoreProvider')
  }
  return context
}