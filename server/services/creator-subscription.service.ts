import { CreatorSubscriptionStatus } from '@prisma/client'
import { prisma } from '@/server/db/prisma'
import { getAppBaseUrl, getStripe } from '@/server/payments/stripe'

export async function createCreatorSubscriptionCheckout(creatorEmail: string, subscriberId: string) {
  const creator = await prisma.user.findUnique({ where: { email: creatorEmail } })
  if (!creator) {
    throw new Error('Creator not found')
  }
  if (creator.id === subscriberId) {
    throw new Error('Cannot subscribe to yourself')
  }

  const stripe = getStripe()
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    success_url: `${getAppBaseUrl()}/dashboard/revenue?creatorSubscription=success`,
    cancel_url: `${getAppBaseUrl()}/dashboard/revenue?creatorSubscription=cancelled`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'gbp',
          recurring: { interval: 'month' },
          unit_amount: 999,
          product_data: {
            name: `Subscription to ${creator.email}`,
          },
        },
      },
    ],
    metadata: {
      type: 'creator_subscription',
      creatorId: creator.id,
      subscriberId,
    },
  })

  const stripeCheckoutSessionId = checkoutSession.id
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
    checkoutUrl: checkoutSession.url,
    subscriptionId: subscription.id,
  }
}

export async function getCreatorSubscriptionStatus(creatorEmail: string, subscriberId: string) {
  const creator = await prisma.user.findUnique({ where: { email: creatorEmail } })
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
