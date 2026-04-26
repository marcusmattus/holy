import { randomBytes } from 'node:crypto'
import { prisma } from '@/server/db/client'

const REFERRAL_REWARD_RATE = 0.05

export async function createReferral(input: {
  referrerId: string
  listingId?: string
}) {
  return prisma.referral.create({
    data: {
      referrerId: input.referrerId,
      listingId: input.listingId,
      code: randomBytes(6).toString('hex').toUpperCase(),
      status: 'PENDING',
    },
  })
}

export async function getReferralByCode(code: string) {
  return prisma.referral.findUnique({ where: { code } })
}

export async function recordReferralConversion(input: {
  code: string
  referredId?: string
  purchaseId: string
  purchaseAmountCents: number
}) {
  const referral = await prisma.referral.findUnique({
    where: { code: input.code },
  })

  if (!referral || referral.status === 'CONVERTED') {
    return null
  }

  const amountCents = Math.floor(input.purchaseAmountCents * REFERRAL_REWARD_RATE)

  return prisma.$transaction(async (tx) => {
    const converted = await tx.referral.update({
      where: { id: referral.id },
      data: {
        status: 'CONVERTED',
        referredId: input.referredId,
      },
    })

    await tx.rewardLedger.create({
      data: {
        userId: referral.referrerId,
        sourceType: 'REFERRAL',
        sourceId: input.purchaseId,
        amount: amountCents,
        currency: 'GBP_CENTS',
        status: 'AVAILABLE',
        description: 'Referral conversion reward',
        metadata: {
          referralId: referral.id,
          referralCode: referral.code,
        },
      },
    })

    return converted
  })
}
