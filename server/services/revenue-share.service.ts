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

  return prisma.$transaction(
    rules.map((rule) =>
      prisma.revenueShare.create({
        data: {
          purchaseId: purchase.id,
          recipientId: rule.recipientId,
          role: rule.role,
          amountCents: Math.floor((purchase.amountCents * rule.basisPoints) / 10000),
          currency: purchase.currency,
          status: 'AVAILABLE',
        },
      })
    )
  )
}
