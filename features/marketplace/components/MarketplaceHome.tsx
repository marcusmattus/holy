import { FeaturedAssetCarousel } from '@/features/marketplace/components/FeaturedAssetCarousel'

export function MarketplaceHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-white">Marketplace Discovery</h1>
      <FeaturedAssetCarousel />
    </div>
  )
}
