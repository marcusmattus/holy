import { RewardKind } from '@prisma/client'
import { prisma } from '@/server/db/client'

export async function recordReward(input: {
  userId: string
  amountCents: number
  kind: RewardKind
  projectId?: string
  listingId?: string
  note?: string
}) {
  return prisma.rewardLedger.create({
    data: {
      userId: input.userId,
      amountCents: input.amountCents,
      kind: input.kind,
      projectId: input.projectId,
      listingId: input.listingId,
      note: input.note,
    },
  })
}

export async function getRewardSummary(userId: string) {
  const rows = await prisma.rewardLedger.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  const totalCents = rows.reduce((sum, row) => sum + row.amountCents, 0)
  const creatorCents = rows
    .filter((row) => row.kind === RewardKind.CREATOR_EARNING)
    .reduce((sum, row) => sum + row.amountCents, 0)
  const referralCents = rows
    .filter((row) => row.kind === RewardKind.REFERRAL_REWARD)
    .reduce((sum, row) => sum + row.amountCents, 0)

  return {
    totalCents,
    creatorCents,
    referralCents,
    entries: rows,
  }
}
