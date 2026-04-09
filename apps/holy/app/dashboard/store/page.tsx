import { AppGrid } from '@/components/store/app-grid'
import { SearchFilters } from '@/components/store/search-filters'

export const metadata = { title: 'Store — Holy' }

export default function StorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Web App Store</h1>
        <p className="text-muted-foreground text-sm mt-1">Discover and install apps built by the Holy community</p>
      </div>
      <SearchFilters />
      <AppGrid />
    </div>
  )
}
