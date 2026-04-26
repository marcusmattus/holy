'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackClientEvent } from '@/lib/analytics/client'

type StoreListingData = {
  id: string
  projectId: string
  name: string
  description: string
  slug: string
  price: number
}

export function StoreListingClient({ listing }: { listing: StoreListingData }) {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const [checkoutState, setCheckoutState] = useState<'idle' | 'processing' | 'done'>('idle')
  const [referralUrl, setReferralUrl] = useState<string | null>(null)

  useEffect(() => {
    void trackClientEvent({
      listingId: listing.id,
      projectId: listing.projectId,
      eventName: 'STORE_VIEW',
      metadata: { ref },
    })
  }, [listing.id, listing.projectId, ref])

  async function handleInstall() {
    setCheckoutState('processing')

    await trackClientEvent({
      listingId: listing.id,
      projectId: listing.projectId,
      eventName: 'INSTALL_CLICK',
      metadata: { ref },
    })

    const res = await fetch('/api/store/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: listing.id,
        expectedPrice: listing.price,
        referralCode: ref,
      }),
    })

    if (res.ok) {
      setCheckoutState('done')
      if (listing.price === 0) {
        await trackClientEvent({
          listingId: listing.id,
          projectId: listing.projectId,
          eventName: 'INSTALL_COMPLETED',
          metadata: { ref },
        })
      } else {
        await trackClientEvent({
          listingId: listing.id,
          projectId: listing.projectId,
          eventName: 'PURCHASE_COMPLETED',
          metadata: { ref, price: listing.price },
        })
      }
    } else {
      setCheckoutState('idle')
    }
  }

  async function createReferralLink() {
    const res = await fetch('/api/referrals/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referrerId: 'demo-user',
        listingId: listing.id,
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (typeof data.url === 'string') {
      setReferralUrl(data.url)
      await navigator.clipboard.writeText(data.url)
    }
  }

  const ctaText = useMemo(() => {
    if (checkoutState === 'processing') return 'Processing...'
    if (checkoutState === 'done') return listing.price === 0 ? 'Installed' : 'Purchased'
    return listing.price === 0 ? 'Install for free' : `Buy for $${listing.price}`
  }, [checkoutState, listing.price])

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div>
        <h1 className="text-2xl font-semibold">{listing.name}</h1>
        <p className="text-sm text-muted-foreground mt-2">{listing.description}</p>
      </div>

      {ref ? (
        <p className="text-xs text-[#D4AF37]">Referral applied: {ref}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleInstall}
          disabled={checkoutState === 'processing'}
          className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6D28D9] disabled:opacity-60"
        >
          {ctaText}
        </button>
        <button
          onClick={createReferralLink}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Share / create referral link
        </button>
        <a
          href={`/projects/${listing.projectId}/deploy`}
          onClick={() => {
            void trackClientEvent({
              projectId: listing.projectId,
              listingId: listing.id,
              eventName: 'APP_VIEW',
            })
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Open live app
        </a>
      </div>

      {referralUrl ? (
        <p className="text-xs text-muted-foreground break-all">
          Referral link copied: <span className="text-[#D4AF37]">{referralUrl}</span>
        </p>
      ) : null}
    </div>
  )
}
