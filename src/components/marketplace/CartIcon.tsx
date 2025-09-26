'use client'

import { ShoppingCart } from 'lucide-react'
import { useApp, getCartItemCount } from '@/lib/store'
import Link from 'next/link'

export default function CartIcon() {
  const { state } = useApp()
  const itemCount = getCartItemCount(state.cart)

  return (
    <Link href="/carrinho" className="relative inline-block">
      <button className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors" data-testid="cart-icon-btn">
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse"
            data-testid="cart-item-count"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>
    </Link>
  )
}
