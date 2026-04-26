import { prisma } from '@/server/db/client'

const PLATFORM_BPS = 1500

export async function ensureDefaultRevenueRules(input: {
  listingId: string
  creatorId: string
}) {
  const existing = await prisma.revenueShareRule.findMany({
    where: { listingId: input.listingId },
  })

  if (existing.length > 0) {
    return existing
  }

  return prisma.$transaction([
    prisma.revenueShareRule.create({
      data: {
        listingId: input.listingId,
        recipientId: input.creatorId,
        role: 'CREATOR',
        basisPoints: 8500,
      },
    }),
    prisma.revenueShareRule.create({
      data: {
        listingId: input.listingId,
        recipientId: input.creatorId,
        role: 'PLATFORM',
        basisPoints: PLATFORM_BPS,
      },
    }),
  ])
}

export async function allocateRevenueShares(input: { purchaseId: string }) {
  const purchase = await prisma.purchase.findUniqueOrThrow({
    where: { id: input.purchaseId },
    include: {
      listing: {
        include: {
          project: true,
          revenueShareRules: true,
        },
      },
      revenueShares: true,
    },
  })

  if (purchase.revenueShares.length > 0) {
    return purchase.revenueShares
  }

  let rules = purchase.listing.revenueShareRules
  if (rules.length === 0) {
    rules = await ensureDefaultRevenueRules({
      listingId: purchase.listingId,
      creatorId: purchase.listing.project.userId,
    })
  }

  const totalBps = rules.reduce((sum, rule) => sum + rule.basisPoints, 0)
  if (totalBps > 10000) {
    throw new Error('Revenue share rules exceed 100%')
  }

  const allocations = rules.map((rule) => ({
    rule,
    amountCents: Math.floor((purchase.amountCents * rule.basisPoints) / 10000),
  }))
  const allocatedTotal = allocations.reduce(
    (sum, allocation) => sum + allocation.amountCents,
    0
  )
  const remainder = purchase.amountCents - allocatedTotal

  if (remainder > 0 && allocations.length > 0) {
    const creatorIndex = allocations.findIndex(
      (allocation) => allocation.rule.role === 'CREATOR'
    )
    // Prefer CREATOR for rounding remainder; fallback to first rule if no creator rule exists.
    const targetIndex = creatorIndex >= 0 ? creatorIndex : 0
    allocations[targetIndex].amountCents += remainder
  }

  return prisma.$transaction(
    allocations.map((allocation) =>
      prisma.revenueShare.create({
        data: {
          purchaseId: purchase.id,
          recipientId: allocation.rule.recipientId,
          role: allocation.rule.role,
          amountCents: allocation.amountCents,
          currency: purchase.currency,
          status: 'AVAILABLE',
        },
      })
    )
  )
}
