import { prisma } from '@/server/db/client'
import { getListingDisplayName } from '@/server/services/listing-utils'
import { recordReward } from '@/server/services/reward-ledger.service'
import { stripe } from '@/server/stripe/client'

async function ensureInstall(input: { listingId: string; userId: string }) {
  const existing = await prisma.install.findUnique({
    where: {
      listingId_userId: {
        listingId: input.listingId,
        userId: input.userId,
      },
    },
  })

  if (existing) {
    return { install: existing, created: false }
  }

  const install = await prisma.install.create({
    data: {
      listingId: input.listingId,
      userId: input.userId,
    },
  })

  return { install, created: true }
}

export async function createStoreCheckoutSession(input: {
  listingId: string
  buyerId: string
  referralCode?: string
}) {
  const [listing, buyer] = await Promise.all([
    prisma.storeListing.findUniqueOrThrow({
      where: { id: input.listingId },
      include: { project: true },
    }),
    prisma.user.findUniqueOrThrow({
      where: { id: input.buyerId },
    }),
  ])

  if (listing.priceType === 'FREE' || listing.priceCents <= 0) {
    const { install, created } = await ensureInstall({
      listingId: listing.id,
      userId: input.buyerId,
    })

    if (created) {
      await recordReward({
        userId: listing.project.userId,
        sourceType: 'INSTALL',
        sourceId: install.id,
        amount: 10,
        currency: 'POINTS',
        description: `Free install reward from ${getListingDisplayName(listing)}`,
        metadata: {
          buyerId: buyer.id,
          listingId: listing.id,
        },
      })
    }

    return {
      mode: 'free' as const,
      install,
    }
  }

  const purchase = await prisma.purchase.create({
    data: {
      listingId: listing.id,
      buyerId: buyer.id,
      amountCents: listing.priceCents,
      currency: listing.currency,
      status: 'PENDING',
    },
  })

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL is required')
  }

  const session = await stripe.checkout.sessions.create({
    mode: listing.priceType === 'SUBSCRIPTION' ? 'subscription' : 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/${listing.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/${listing.slug}`,
    client_reference_id: purchase.id,
    metadata: {
      purchaseId: purchase.id,
      listingId: listing.id,
      buyerId: buyer.id,
      referralCode: input.referralCode ?? '',
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: listing.currency,
          unit_amount: listing.priceCents,
          product_data: {
            name: getListingDisplayName(listing),
            description: listing.description,
          },
          recurring:
            listing.priceType === 'SUBSCRIPTION'
              ? {
                  interval: 'month',
                }
              : undefined,
        },
      },
    ],
  })

  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { stripeSessionId: session.id },
  })

  return {
    mode: 'paid' as const,
    purchase,
    checkoutUrl: session.url,
  }
}
