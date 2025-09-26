import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader'
import MarketplaceHero from '@/components/marketplace/MarketplaceHero'
import ProductGrid from '@/components/marketplace/ProductGrid'
import VendorSection from '@/components/marketplace/VendorSection'
import PaymentSection from '@/components/marketplace/PaymentSection'
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter'

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <MarketplaceHeader />
      <MarketplaceHero />
      <ProductGrid />
      <VendorSection />
      <PaymentSection />
      <MarketplaceFooter />
    </main>
  )
}