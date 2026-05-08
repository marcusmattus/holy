/**
 * Holystic Protocol — server-side service layer
 * Handles reward ledger entries, settlement logic, and HOL accounting.
 */

import { prisma } from '@/lib/db'

// Local alias until `prisma generate` runs with the updated schema
type RewardType =
  | 'INSTALL_BOUNTY'
  | 'REVENUE_SHARE'
  | 'REFERRAL'
  | 'CREATOR_GRANT'
  | 'PROTOCOL_BONUS'

export type EmitRewardInput = {
  userId: string
  type: RewardType
  amountUsdc: number
  amountHol?: number
  description?: string
  projectId?: string
  txHash?: string
}

/**
 * Emit a new reward entry into the ledger (PENDING state).
 */
export async function emitReward(input: EmitRewardInput) {
  return prisma.rewardLedger.create({
    data: {
      userId: input.userId,
      type: input.type,
      amountUsdc: input.amountUsdc,
      amountHol: input.amountHol ?? 0,
      description: input.description,
      projectId: input.projectId,
      txHash: input.txHash,
      status: 'PENDING',
    },
  })
}

/**
 * Mark a reward as settled (after on-chain confirmation).
 */
export async function settleReward(id: string, txHash: string) {
  return prisma.rewardLedger.update({
    where: { id },
    data: {
      status: 'SETTLED',
      txHash,
      settledAt: new Date(),
    },
  })
}

/**
 * Calculate claimable balance for a user.
 */
export async function getClaimableBalance(userId: string) {
  const pending = await prisma.rewardLedger.findMany({
    where: { userId, status: 'PENDING' },
  })
  type Entry = (typeof pending)[number]
  return {
    usdc: pending.reduce((s: number, l: Entry) => s + l.amountUsdc, 0),
    hol: pending.reduce((s: number, l: Entry) => s + l.amountHol, 0),
    entries: pending,
  }
}

/**
 * Compute and emit an install bounty reward for a project owner.
 * Called by store.service.recordInstall internally.
 */
export async function emitInstallBounty(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true, name: true },
  })
  if (!project) return

  await emitReward({
    userId: project.userId,
    type: 'INSTALL_BOUNTY',
    amountUsdc: 0.5,    // $0.50 per install
    amountHol: 2,       // 2 HOL per install
    description: `${project.name} — new install`,
    projectId,
  })
}
