import { prisma } from '@/server/db/client'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

async function ensureUniqueSlug(baseSlug: string, projectId: string) {
  const root = baseSlug || `project-${projectId.slice(-6)}`
  let candidate = root
  let count = 1
  const maxAttempts = 100

  while (count <= maxAttempts) {
    const existing = await prisma.storeListing.findUnique({ where: { slug: candidate } })
    if (!existing || existing.projectId === projectId) {
      return candidate
    }
    candidate = `${root}-${count}`
    count += 1
  }

  throw new Error(`Unable to generate unique listing slug after ${maxAttempts} attempts`)
}

export async function publishProject(input: {
  projectId: string
  title: string
  description: string
  category?: string
  priceType?: 'FREE' | 'ONE_TIME' | 'SUBSCRIPTION'
  priceCents?: number
}) {
  if (!input.title.trim()) {
    throw new Error('Listing title is required')
  }

  const slug = await ensureUniqueSlug(slugify(input.title), input.projectId)

  const listing = await prisma.storeListing.upsert({
    where: { projectId: input.projectId },
    update: {
      title: input.title,
      name: input.title,
      slug,
      description: input.description,
      category: input.category,
      priceType: input.priceType ?? 'FREE',
      priceCents: input.priceCents ?? 0,
      isPublished: true,
      status: 'PUBLISHED',
    },
    create: {
      projectId: input.projectId,
      title: input.title,
      name: input.title,
      slug,
      description: input.description,
      category: input.category,
      priceType: input.priceType ?? 'FREE',
      priceCents: input.priceCents ?? 0,
      isPublished: true,
      status: 'PUBLISHED',
    },
  })

  await prisma.project.update({
    where: { id: input.projectId },
    data: { status: 'PUBLISHED', slug },
  })

  return listing
}

export async function listPublishedListings() {
  return prisma.storeListing.findMany({
    where: {
      OR: [{ status: 'PUBLISHED' }, { isPublished: true }],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { installs: true },
      },
    },
  })
}

export async function getListingBySlug(slug: string) {
  return prisma.storeListing.findFirst({
    where: {
      slug,
      OR: [{ status: 'PUBLISHED' }, { isPublished: true }],
    },
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
      userId: input.userId ?? 'anonymous',
      source: input.source,
    },
  })
}
