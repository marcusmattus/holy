import type Stripe from 'stripe'
import { prisma } from '@/server/db/client'
import { recordReferralConversion } from '@/server/services/referral.service'
import { allocateRevenueShares } from '@/server/services/revenue-share.service'
import { recordReward } from '@/server/services/reward-ledger.service'

async function ensureInstall(listingId: string, userId: string) {
  return prisma.install.upsert({
    where: {
      listingId_userId: {
        listingId,
        userId,
      },
    },
    create: {
      listingId,
      userId,
    },
    update: {},
  })
}

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const purchaseId = session.metadata?.purchaseId
  if (!purchaseId) {
    return
  }

  const existing = await prisma.purchase.findUnique({ where: { id: purchaseId } })
  if (!existing) {
    return
  }

  const purchase = await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      status: 'PAID',
      stripePaymentIntent:
        typeof session.payment_intent === 'string' ? session.payment_intent : existing.stripePaymentIntent,
    },
    include: {
      listing: {
        include: {
          project: true,
        },
      },
    },
  })

  await ensureInstall(purchase.listingId, purchase.buyerId)
  await allocateRevenueShares({ purchaseId })

  const existingPurchaseReward = await prisma.rewardLedger.findFirst({
    where: {
      userId: purchase.listing.project.userId,
      sourceType: 'PURCHASE',
      sourceId: purchase.id,
      currency: 'GBP_CENTS',
    },
  })

  if (!existingPurchaseReward) {
    await recordReward({
      userId: purchase.listing.project.userId,
      sourceType: 'PURCHASE',
      sourceId: purchase.id,
      amount: purchase.amountCents,
      currency: 'GBP_CENTS',
      description: `Revenue from ${purchase.listing.title || purchase.listing.name}`,
    })
  }

  const referralCode = session.metadata?.referralCode
  if (referralCode) {
    await recordReferralConversion({
      code: referralCode,
      referredId: purchase.buyerId,
      purchaseId: purchase.id,
      purchaseAmountCents: purchase.amountCents,
    })
  }
}
