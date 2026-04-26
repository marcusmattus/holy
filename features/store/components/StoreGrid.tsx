'use client'

import { useEffect, useState } from 'react'
import { StoreListingCard } from './StoreListingCard'

type StoreListingSummary = {
  id: string
  title: string
  slug: string
  description: string
  category: string | null
  priceType: 'FREE' | 'ONE_TIME' | 'SUBSCRIPTION'
  priceCents: number
}

export function StoreGrid() {
  const [listings, setListings] = useState<StoreListingSummary[]>([])

  useEffect(() => {
    fetch('/api/store')
      .then((res) => res.json())
      .then((data) => setListings(data.listings ?? []))
  }, [])

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-8 py-12 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,74,0.08),transparent_40%)]" />
      <header className="mx-auto mb-12 max-w-6xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A24A]">Holy Store</p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight">Generated apps marketplace</h1>
        <p className="mt-4 max-w-xl text-white/40">Discover, duplicate, install, and monetize AI-generated apps built inside Holy Studio.</p>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <StoreListingCard key={listing.id} listing={listing} />
        ))}
      </section>
    </main>
  )
}
