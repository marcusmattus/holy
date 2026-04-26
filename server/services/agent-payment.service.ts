import { PriceType, PurchaseStatus } from '@prisma/client'
import { prisma } from '@/server/services/prisma'

const PLATFORM_FEE_BPS = 1500
const CREATOR_FEE_BPS = 8500

export async function canInstallWithoutPayment(agentListingId: string) {
  const listing = await prisma.agentListing.findUnique({
    where: { id: agentListingId },
    select: { priceType: true },
  })
  return listing?.priceType === PriceType.FREE
}

export async function createAgentCheckout(input: {
  agentListingId: string
  buyerId: string
}) {
  const listing = await prisma.agentListing.findUnique({
    where: { id: input.agentListingId },
  })
  if (!listing) throw new Error('Agent listing not found')

  if (listing.priceType === PriceType.FREE) {
    return { mode: 'free', requiresPayment: false }
  }

  const purchase = await prisma.agentPurchase.create({
    data: {
      agentListingId: listing.id,
      buyerId: input.buyerId,
      amountCents: listing.priceCents,
      status: PurchaseStatus.PENDING,
    },
  })

  return {
    mode: 'payment',
    requiresPayment: true,
    purchaseId: purchase.id,
    amountCents: purchase.amountCents,
    feeBreakdown: {
      platformFeeBps: PLATFORM_FEE_BPS,
      creatorFeeBps: CREATOR_FEE_BPS,
    },
    message:
      'Stripe session integration can map purchaseId to checkout session in existing payment flow.',
  }
}
