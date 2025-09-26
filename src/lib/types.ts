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
  images?: string[]
  location?: string
  inStock?: boolean
}

export interface CartItem extends Product {
  quantity: number
}

export interface Filters {
  categories: string[]
  priceRange: { min: number; max: number }
  locations: string[]
  minRating: number
  searchTerm: string
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'reviews'
}

export interface AppState {
  cart: CartItem[]
  favorites: number[]
  filters: Filters
  products: Product[]
}

export type Action =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'UPDATE_FILTERS'; payload: Partial<Filters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'LOAD_STATE'; payload: AppState }
