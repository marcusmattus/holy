import type { Prisma, RewardCurrency, RewardSourceType } from '@prisma/client'
import { prisma } from '@/server/db/client'

export async function recordReward(input: {
  userId: string
  sourceType: RewardSourceType
  sourceId?: string
  amount: number
  currency?: RewardCurrency
  description?: string
  metadata?: Record<string, unknown>
}) {
  return prisma.rewardLedger.create({
    data: {
      userId: input.userId,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      amount: input.amount,
      currency: input.currency ?? 'POINTS',
      description: input.description,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
      status: 'AVAILABLE',
    },
  })
}

export async function getRewardSummary(userId: string) {
  const rewards = await prisma.rewardLedger.findMany({ where: { userId } })

  return rewards.reduce<Record<string, number>>((acc, reward) => {
    acc[reward.currency] = (acc[reward.currency] ?? 0) + reward.amount
    return acc
  }, {})
}
