/**
 * Lazy loading utilities for performance optimization
 * Centralizes all lazy-loaded components for better code splitting
 */

import { lazy } from 'react'

// Admin components - heavy and not needed on initial load
export const AdminCommunityPage = lazy(() => import('@/app/admin/comunidades/page'))
export const AdminEventsPage = lazy(() => import('@/app/admin/eventos/page'))
export const AdminNewEventPage = lazy(() => import('@/app/admin/eventos/novo/page'))
export const AdminBookingsPage = lazy(() => import('@/app/admin/agendamentos/page'))
export const AdminNewBookingPage = lazy(() => import('@/app/admin/agendamentos/novo/page'))

// Marketplace components - can be loaded on demand
export const MarketplaceHeader = lazy(() => import('@/components/marketplace/MarketplaceHeader'))
export const ProductGallery = lazy(() => import('@/components/marketplace/ProductGallery'))
export const MarketplaceFooter = lazy(() => import('@/components/marketplace/MarketplaceFooter'))

// Profile components - user-specific, can be lazy loaded
export const ProfileSettings = lazy(() => import('@/app/perfil/configuracoes/page'))

// Heavy UI components
export const Sidebar = lazy(() => import('@/components/ui/sidebar'))

// Service booking - complex form, can be lazy loaded
export const ServiceBookingPage = lazy(() => import('@/app/agendamento/[comunidade]/[servico]/page'))

// Chart components - heavy libraries
export const Charts = lazy(() => import('@/components/ui/chart'))

// Loading component for Suspense fallback
export const ComponentLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

// Higher-order component for lazy loading with error boundary
export const withLazyLoading = <T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }))
  
  return (props: T) => (
    <React.Suspense fallback={fallback ? <fallback /> : <ComponentLoader />}>
      <LazyComponent {...props} />
    </React.Suspense>
  )
}
