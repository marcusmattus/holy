import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'
import { trackEvent } from '@/server/services/analytics.service'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { listingId, expectedPrice, referralCode, sessionId, simulatePaymentSuccess } = body

  if (!listingId || typeof listingId !== 'string') {
    return NextResponse.json({ error: 'listingId is required' }, { status: 400 })
  }
  if (typeof expectedPrice !== 'number') {
    return NextResponse.json({ error: 'expectedPrice is required' }, { status: 400 })
  }

  const listing = await prisma.storeListing.findUnique({ where: { id: listingId } })
  if (!listing || !listing.isPublished) {
    return NextResponse.json({ error: 'Listing not available' }, { status: 404 })
  }

  const listingPrice = listing.price ?? 0
  if (expectedPrice !== listingPrice) {
    return NextResponse.json({ error: 'Price mismatch' }, { status: 400 })
  }

  await trackEvent({
    listingId,
    projectId: listing.projectId,
    sessionId: typeof sessionId === 'string' ? sessionId : undefined,
    eventName: 'CHECKOUT_STARTED',
    metadata: {
      referralCode: typeof referralCode === 'string' ? referralCode : undefined,
      expectedPrice,
      validatedPrice: listingPrice,
    },
  }).catch(() => null)

  if (listingPrice > 0) {
    if (simulatePaymentSuccess === true) {
      await trackEvent({
        listingId,
        projectId: listing.projectId,
        sessionId: typeof sessionId === 'string' ? sessionId : undefined,
        eventName: 'PURCHASE_COMPLETED',
        metadata: { price: listingPrice, referralCode },
      }).catch(() => null)

      return NextResponse.json({ success: true, purchased: true, amount: listingPrice })
    }

    return NextResponse.json({ success: true, paymentPending: true, amount: listingPrice })
  }

  await trackEvent({
    listingId,
    projectId: listing.projectId,
    sessionId: typeof sessionId === 'string' ? sessionId : undefined,
    eventName: 'INSTALL_COMPLETED',
    metadata: { referralCode },
  }).catch(() => null)

  return NextResponse.json({ success: true, installed: true, amount: 0 })
}
