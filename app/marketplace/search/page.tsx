import { MarketplaceFilters } from '@/features/marketplace/components/MarketplaceFilters'
import { MarketplaceSearchResults } from '@/features/marketplace/components/MarketplaceSearchResults'
import { UniversalSearch } from '@/features/marketplace/components/UniversalSearch'

export default function MarketplaceSearchPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-white">
      <div className="space-y-4">
        <UniversalSearch />
        <MarketplaceFilters />
        <MarketplaceSearchResults />
      </div>
    </main>
  )
}
