import { prisma } from '@/server/db/client'
import { stripe } from '@/server/stripe/client'
import { logger } from '@/lib/logger'

function getSafePayoutErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object') {
    return 'Payout transfer failed'
  }

  const maybeError = error as { type?: string; code?: string; message?: string }
  if (maybeError.type || maybeError.code) {
    return `Stripe error (${maybeError.type ?? 'unknown'}:${maybeError.code ?? 'unknown'})`
  }

  return 'Payout transfer failed'
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
  const payoutCurrency = 'gbp'
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
      currency: payoutCurrency,
      status: 'PROCESSING',
    },
  })

  let transferSent = false

  try {
    const transfer = await stripe.transfers.create({
      amount: amountCents,
      currency: payoutCurrency,
      destination: account.stripeAccountId,
      metadata: {
        payoutId: payout.id,
        userId,
      },
    })
    transferSent = true

    try {
      const [, paidPayout] = await prisma.$transaction([
        prisma.revenueShare.updateMany({
          where: {
            recipientId: userId,
            status: 'AVAILABLE',
          },
          data: {
            status: 'PAID_OUT',
          },
        }),
        prisma.payout.update({
          where: { id: payout.id },
          data: {
            stripeTransferId: transfer.id,
            status: 'PAID',
          },
        }),
      ])

      logger.info({
        event: 'payout.transfer',
        message: 'Stripe transfer created',
        metadata: { payoutId: payout.id, userId, amountCents },
      })

      return paidPayout
    } catch (reconciliationError) {
      await prisma.payout.update({
        where: { id: payout.id },
        data: {
          stripeTransferId: transfer.id,
          status: 'PROCESSING',
          metadata: {
            reconciliationRequired: true,
            reason: 'Transfer sent but payout reconciliation is pending',
          },
        },
      })

      throw reconciliationError
    }
  } catch (error) {
    if (!transferSent) {
      await prisma.payout.update({
        where: { id: payout.id },
        data: {
          status: 'FAILED',
          metadata: {
            reason: getSafePayoutErrorMessage(error),
          },
        },
      })
    }

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
