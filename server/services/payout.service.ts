import { prisma } from '@/server/db/client'
import { stripe } from '@/server/stripe/client'
import { getEnv } from '@/lib/env'

function getPayoutCurrency() {
  return getEnv().PAYOUT_CURRENCY || 'GBP'
}

export async function getAvailablePayoutBalance(userId: string) {
  const shares = await prisma.revenueShare.findMany({
    where: {
      recipientId: userId,
      status: 'AVAILABLE',
    },
  })

  return shares.reduce((sum, share) => sum + share.amountCents, 0)
}

export async function requestCreatorPayout(userId: string) {
  const account = await prisma.creatorPayoutAccount.findUniqueOrThrow({ where: { userId } })

  if (!account.payoutsEnabled) {
    throw new Error('Payout account is not active')
  }

  const amountCents = await getAvailablePayoutBalance(userId)

  if (amountCents <= 0) {
    throw new Error('No available payout balance')
  }

  const payout = await prisma.payout.create({
    data: {
      userId,
      amountCents,
      currency: getPayoutCurrency(),
      status: 'PROCESSING',
    },
  })

  try {
    const transfer = await stripe.transfers.create({
      amount: amountCents,
      currency: getPayoutCurrency(),
      destination: account.stripeAccountId,
      metadata: {
        payoutId: payout.id,
        userId,
      },
    })

    await prisma.revenueShare.updateMany({
      where: {
        recipientId: userId,
        status: 'AVAILABLE',
      },
      data: {
        status: 'PAID_OUT',
        payoutId: payout.id,
      },
    })

    return prisma.payout.update({
      where: { id: payout.id },
      data: {
        stripeTransferId: transfer.id,
        status: 'PAID',
      },
    })
  } catch (error) {
    await prisma.payout.update({
      where: { id: payout.id },
      data: {
        status: 'FAILED',
        metadata: {
          reason: error instanceof Error ? error.message : 'Unknown transfer failure',
        },
      },
    })

    throw error
  }
}

export async function getCreatorPayoutSummary(userId: string) {
  const [available, pending, paid] = await Promise.all([
    getAvailablePayoutBalance(userId),
    prisma.revenueShare.aggregate({
      where: { recipientId: userId, status: 'PENDING' },
      _sum: { amountCents: true },
    }),
    prisma.payout.aggregate({
      where: { userId, status: 'PAID' },
      _sum: { amountCents: true },
    }),
  ])

  const topApps = await prisma.revenueShare.groupBy({
    by: ['listingId'],
    where: { recipientId: userId },
    _sum: { amountCents: true },
    orderBy: { _sum: { amountCents: 'desc' } },
    take: 5,
  })

  const referral = await prisma.revenueShare.aggregate({
    where: {
      recipientId: userId,
      referralCode: { not: null },
    },
    _sum: { amountCents: true },
  })

  return {
    availableCents: available,
    pendingCents: pending._sum.amountCents ?? 0,
    paidOutCents: paid._sum.amountCents ?? 0,
    referralRevenueCents: referral._sum.amountCents ?? 0,
    currency: getPayoutCurrency(),
    topAppsByRevenue: topApps.map((row) => ({
      listingId: row.listingId,
      revenueCents: row._sum?.amountCents ?? 0,
    })),
  }
}
