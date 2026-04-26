const featuredAssets = [
  'Featured apps',
  'Certified agents',
  'Trending templates',
  'Popular workflows',
  'Top creators',
  'Enterprise-ready integrations',
]

export function FeaturedAssetCarousel() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {featuredAssets.map((asset) => (
        <div key={asset} className="rounded-2xl border border-[#2A2A2A] bg-[#121212]/80 p-4 text-sm text-[#EAEAEA]">
          {asset}
        </div>
      ))}
    </div>
  )
}
