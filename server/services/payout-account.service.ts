import { prisma } from '@/server/db/client'
import { stripe } from '@/server/stripe/client'
import { requireEnv } from '@/lib/env'

export async function createOrGetPayoutAccount(userId: string) {
  const existing = await prisma.creatorPayoutAccount.findUnique({ where: { userId } })
  if (existing) return existing

  const account = await stripe.accounts.create({
    type: 'express',
    capabilities: {
      transfers: { requested: true },
    },
    metadata: { userId },
  })

  return prisma.creatorPayoutAccount.create({
    data: {
      userId,
      stripeAccountId: account.id,
      onboardingStatus: 'PENDING',
    },
  })
}

export async function createPayoutOnboardingLink(userId: string) {
  const account = await createOrGetPayoutAccount(userId)
  const { NEXT_PUBLIC_APP_URL } = requireEnv(['NEXT_PUBLIC_APP_URL'])

  const link = await stripe.accountLinks.create({
    account: account.stripeAccountId,
    refresh_url: `${NEXT_PUBLIC_APP_URL}/api/payouts/connect/refresh?userId=${userId}`,
    return_url: `${NEXT_PUBLIC_APP_URL}/api/payouts/connect/return?userId=${userId}`,
    type: 'account_onboarding',
  })

  await prisma.creatorPayoutAccount.update({
    where: { userId },
    data: { onboardingStatus: 'ONBOARDING' },
  })

  return link.url
}

export async function syncPayoutAccount(userId: string) {
  const payoutAccount = await prisma.creatorPayoutAccount.findUniqueOrThrow({ where: { userId } })
  const account = await stripe.accounts.retrieve(payoutAccount.stripeAccountId)

  return prisma.creatorPayoutAccount.update({
    where: { userId },
    data: {
      payoutsEnabled: Boolean(account.payouts_enabled),
      chargesEnabled: Boolean(account.charges_enabled),
      onboardingStatus: account.payouts_enabled ? 'ACTIVE' : 'RESTRICTED',
    },
  })
}
