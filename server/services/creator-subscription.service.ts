import { CreatorSubscriptionStatus } from '@prisma/client'
import { prisma } from '@/server/db/prisma'

export async function createCreatorSubscriptionCheckout(handle: string, subscriberId: string) {
  const creator = await prisma.user.findUnique({ where: { email: handle } })
  if (!creator) {
    throw new Error('Creator not found')
  }
  if (creator.id === subscriberId) {
    throw new Error('Cannot subscribe to yourself')
  }

  const stripeCheckoutSessionId = `cs_creator_${creator.id}_${subscriberId}_${Date.now()}`
  const subscription = await prisma.creatorSubscription.upsert({
    where: {
      creatorId_subscriberId: {
        creatorId: creator.id,
        subscriberId,
      },
    },
    create: {
      creatorId: creator.id,
      subscriberId,
      status: CreatorSubscriptionStatus.PENDING,
      stripeCheckoutSessionId,
    },
    update: {
      status: CreatorSubscriptionStatus.PENDING,
      stripeCheckoutSessionId,
    },
  })

  return {
    checkoutUrl: `https://checkout.stripe.com/pay/${stripeCheckoutSessionId}`,
    subscriptionId: subscription.id,
  }
}

export async function getCreatorSubscriptionStatus(handle: string, subscriberId: string) {
  const creator = await prisma.user.findUnique({ where: { email: handle } })
  if (!creator) return { status: 'NONE' as const }

  const subscription = await prisma.creatorSubscription.findFirst({
    where: { creatorId: creator.id, subscriberId },
  })
  return { status: subscription?.status ?? 'NONE' }
}

export async function updateCreatorSubscriptionByStripeId(
  stripeSubscriptionId: string,
  status: CreatorSubscriptionStatus
) {
  const existing = await prisma.creatorSubscription.findUnique({
    where: { stripeSubscriptionId },
  })
  if (!existing) return null

  return prisma.creatorSubscription.update({
    where: { id: existing.id },
    data: { status },
  })
}

export async function markCreatorSubscriptionActiveByCheckoutSession(
  stripeCheckoutSessionId: string,
  stripeSubscriptionId?: string
) {
  const existing = await prisma.creatorSubscription.findUnique({
    where: { stripeCheckoutSessionId },
  })
  if (!existing) return null

  return prisma.creatorSubscription.update({
    where: { id: existing.id },
    data: {
      status: CreatorSubscriptionStatus.ACTIVE,
      stripeSubscriptionId: stripeSubscriptionId ?? existing.stripeSubscriptionId,
    },
  })
}
