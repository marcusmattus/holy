import Link from 'next/link'
import { prisma } from '@/server/db/client'

export default async function StoreListingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ listingId?: string; ref?: string }>
}) {
  const { listingId, ref } = await searchParams

  if (listingId) {
    try {
      await prisma.analyticsEvent.upsert({
        where: {
          idempotencyKey: `success:${listingId}:${ref ?? 'none'}`,
        },
        create: {
          listingId,
          eventType: 'INSTALL',
          referralCode: ref,
          idempotencyKey: `success:${listingId}:${ref ?? 'none'}`,
          installEventKey: `install:${listingId}:${ref ?? 'none'}`,
        },
        update: {},
      })
    } catch {}
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-4">
      <h1 className="text-3xl font-semibold">Install complete</h1>
      <p className="text-muted-foreground">Your Holy Store install has been recorded successfully.</p>
      <Link href="/dashboard/store" className="text-sm text-[#EAB308] hover:underline">
        Back to Store dashboard
      </Link>
    </div>
  )
}
