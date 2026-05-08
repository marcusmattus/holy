/**
 * Holy Store — server-side service layer
 * Handles listing submission, status transitions, and install tracking.
 */

import { prisma } from '@/lib/db'

// Local aliases until `prisma generate` runs with the updated schema
type StoreEntry = Awaited<ReturnType<typeof prisma.storeEntry.create>>
type StoreStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'REJECTED'

export type PublishInput = {
  projectId: string
  shortDescription?: string
  longDescription?: string
  demoUrl?: string
  screenshots?: string[]
}

/**
 * Submit a project for store review. Creates a StoreEntry if one does not
 * exist, otherwise transitions existing DRAFT or REJECTED entry to IN_REVIEW.
 */
export async function submitForReview(input: PublishInput): Promise<StoreEntry> {
  const existing = await prisma.storeEntry.findUnique({
    where: { projectId: input.projectId },
  })

  const data = {
    longDescription: input.longDescription ?? null,
    demoUrl: input.demoUrl ?? null,
    screenshots: input.screenshots ? JSON.stringify(input.screenshots) : null,
    status: 'IN_REVIEW' as StoreStatus,
    submittedAt: new Date(),
  }

  if (existing) {
    return prisma.storeEntry.update({
      where: { projectId: input.projectId },
      data,
    })
  }

  return prisma.storeEntry.create({
    data: { projectId: input.projectId, ...data },
  })
}

/**
 * Approve a store listing (admin action).
 */
export async function approveListing(projectId: string): Promise<StoreEntry> {
  return prisma.storeEntry.update({
    where: { projectId },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  })
}

/**
 * Reject a store listing with optional reason.
 */
export async function rejectListing(projectId: string): Promise<StoreEntry> {
  return prisma.storeEntry.update({
    where: { projectId },
    data: { status: 'REJECTED' },
  })
}

/**
 * Record an install and optionally emit a Protocol reward event.
 */
export async function recordInstall(projectId: string): Promise<void> {
  const entry = await prisma.storeEntry.findUnique({ where: { projectId } })
  if (!entry) return

  await prisma.storeEntry.update({
    where: { projectId },
    data: { installs: { increment: 1 } },
  })

  // Emit analytics event
  await prisma.analyticsEvent.create({
    data: { projectId, event: 'install' },
  })
}

/**
 * Return published listings ordered by install count.
 */
export async function getFeaturedListings(limit = 20) {
  return prisma.storeEntry.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          thumbnail: true,
          category: true,
          storePrice: true,
          user: { select: { name: true, avatarUrl: true } },
        },
      },
    },
    orderBy: { installs: 'desc' },
    take: limit,
  })
}
