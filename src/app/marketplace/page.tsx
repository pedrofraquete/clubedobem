import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader'
import MarketplaceHero from '@/components/marketplace/MarketplaceHero'
import SearchBar from '@/components/marketplace/SearchBar'
import SupabaseProductGrid from '@/components/marketplace/SupabaseProductGrid'
import VendorSection from '@/components/marketplace/VendorSection'
import PaymentSection from '@/components/marketplace/PaymentSection'
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter'

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <MarketplaceHeader />
      <MarketplaceHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar />
        <SupabaseProductGrid />
      </div>
      <VendorSection />
      <PaymentSection />
      <MarketplaceFooter />
    </main>
  )
}