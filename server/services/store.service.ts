import { PricingModel } from '@prisma/client'
import { prisma } from '@/server/db/client'

const PROJECT_ID_SUFFIX_LENGTH = 6
const MAX_SLUG_ATTEMPTS = 20

function slugify(value: string) {
  const input = value.toLowerCase()
  let result = ''
  let previousWasDash = false

  for (const char of input) {
    const isAlphaNumeric =
      (char >= 'a' && char <= 'z') || (char >= '0' && char <= '9')

    if (isAlphaNumeric) {
      result += char
      previousWasDash = false
      continue
    }

    if (!previousWasDash) {
      result += '-'
      previousWasDash = true
    }
  }

  while (result.startsWith('-')) {
    result = result.slice(1)
  }

  while (result.endsWith('-')) {
    result = result.slice(0, -1)
  }

  return result
}

async function resolveUniqueSlug(baseSlug: string, projectId: string) {
  const fallbackSlug = baseSlug || 'holy-app'
  const projectSuffix = projectId.slice(-PROJECT_ID_SUFFIX_LENGTH)
  let candidate = `${fallbackSlug}-${projectSuffix}`
  let attempt = 1

  while (
    attempt <= MAX_SLUG_ATTEMPTS &&
    (await prisma.storeListing.findUnique({ where: { slug: candidate } }))
  ) {
    candidate = `${fallbackSlug}-${projectSuffix}-${attempt}`
    attempt += 1
  }

  if (attempt > MAX_SLUG_ATTEMPTS) {
    throw new Error('Failed to generate a unique listing slug')
  }

  return candidate
}

export async function publishProjectListing(input: {
  projectId: string
  name: string
  description: string
  price?: number | null
  pricingModel?: PricingModel
}) {
  const existing = await prisma.storeListing.findUnique({
    where: { projectId: input.projectId },
  })
  const baseSlug = slugify(input.name)
  const slug = existing?.slug ?? (await resolveUniqueSlug(baseSlug, input.projectId))
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
