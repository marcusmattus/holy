import { prisma } from '@/server/db/client'
import { stripe } from '@/server/stripe/client'
import { logger } from '@/lib/logger'

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
      currency: 'gbp',
      status: 'PROCESSING',
    },
  })

  try {
    const transfer = await stripe.transfers.create({
      amount: amountCents,
      currency: 'gbp',
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
      },
    })

    logger.info({
      event: 'payout.transfer',
      message: 'Stripe transfer created',
      metadata: { payoutId: payout.id, userId, amountCents },
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
        metadata: { reason: error instanceof Error ? error.message : 'Unknown payout failure' },
      },
    })

    throw error
  }
}

export async function getPayoutSummary(userId: string) {
  const [availableBalance, payoutAccount, payouts, revenueShares] = await Promise.all([
    getAvailablePayoutBalance(userId),
    prisma.creatorPayoutAccount.findUnique({ where: { userId } }),
    prisma.payout.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.revenueShare.findMany({ where: { recipientId: userId } }),
  ])

  const pendingRevenueShares = revenueShares
    .filter((share) => share.status === 'PENDING')
    .reduce((sum, share) => sum + share.amountCents, 0)

  const paidOutTotal = payouts
    .filter((payout) => payout.status === 'PAID')
    .reduce((sum, payout) => sum + payout.amountCents, 0)

  return {
    availableBalance,
    pendingRevenueShares,
    paidOutTotal,
    payoutAccount,
    payouts,
  }
}
