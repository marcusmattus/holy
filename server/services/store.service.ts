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
      slug,
      description: input.description,
      category: input.category,
      priceType: input.priceType ?? 'FREE',
      priceCents: input.priceCents ?? 0,
      status: 'PUBLISHED',
    },
    create: {
      projectId: input.projectId,
      title: input.title,
      slug,
      description: input.description,
      category: input.category,
      priceType: input.priceType ?? 'FREE',
      priceCents: input.priceCents ?? 0,
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
    where: { status: 'PUBLISHED' },
    include: { project: true, installs: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getListingBySlug(slug: string) {
  return prisma.storeListing.findUnique({
    where: { slug },
    include: { project: { include: { files: true } }, installs: true },
  })
}
