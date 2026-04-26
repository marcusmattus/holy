import { prisma } from '@/server/db/client'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function publishProject(input: {
  projectId: string
  title: string
  description: string
  category?: string
  priceType?: 'FREE' | 'ONE_TIME' | 'SUBSCRIPTION'
  priceCents?: number
}) {
  const slug = slugify(input.title)

  const listing = await prisma.storeListing.upsert({
    where: { projectId: input.projectId },
    update: {
      title: input.title,
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
