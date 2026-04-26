import { PricingModel } from '@prisma/client'
import { prisma } from '@/server/db/client'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function publishProjectListing(input: {
  projectId: string
  name: string
  description: string
  price?: number | null
  pricingModel?: PricingModel
}) {
  const baseSlug = slugify(input.name)
  const slug = `${baseSlug || 'holy-app'}-${input.projectId.slice(-6)}`
  const pricingModel =
    input.pricingModel ?? (input.price && input.price > 0 ? PricingModel.PAID : PricingModel.FREE)

  return prisma.storeListing.upsert({
    where: { projectId: input.projectId },
    update: {
      name: input.name,
      description: input.description,
      price: input.price ?? null,
      pricingModel,
      isPublished: true,
    },
    create: {
      projectId: input.projectId,
      name: input.name,
      slug,
      description: input.description,
      price: input.price ?? null,
      pricingModel,
      isPublished: true,
    },
  })
}

export async function listPublishedListings() {
  return prisma.storeListing.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { installs: true },
      },
    },
  })
}

export async function installListing(input: {
  listingId: string
  projectId: string
  userId?: string
  source?: string
}) {
  const existing = await prisma.install.findFirst({
    where: {
      listingId: input.listingId,
      projectId: input.projectId,
      userId: input.userId,
    },
  })

  if (existing) {
    return prisma.install.update({
      where: { id: existing.id },
      data: { source: input.source },
    })
  }

  return prisma.install.create({
    data: {
      listingId: input.listingId,
      projectId: input.projectId,
      userId: input.userId,
      source: input.source,
    },
  })
}
