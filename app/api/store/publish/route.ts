import { randomUUID } from 'node:crypto'
import type { StoreListingPriceType } from '@prisma/client'
import { prisma } from '@/server/db/client'
import { recordReward } from '@/server/services/reward-ledger.service'

const ALLOWED_PRICE_TYPES: StoreListingPriceType[] = [
  'FREE',
  'ONE_TIME',
  'SUBSCRIPTION',
]
import { PricingModel } from '@prisma/client'
import { publishProjectListing } from '@/server/services/store.service'

function isPricingModel(value: unknown): value is PricingModel {
  return typeof value === 'string' && Object.values(PricingModel).includes(value as PricingModel)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { projectId, name, description, price, pricingModel } = body

  if (!projectId || typeof projectId !== 'string') {
    return Response.json({ error: 'projectId is required' }, { status: 400 })
  }
  if (!name || typeof name !== 'string') {
    return Response.json({ error: 'name is required' }, { status: 400 })
  }
  if (!description || typeof description !== 'string') {
    return Response.json({ error: 'description is required' }, { status: 400 })
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })

  if (!project) {
    return Response.json({ error: 'project not found' }, { status: 404 })
  }

  const priceType = ALLOWED_PRICE_TYPES.includes(body.priceType)
    ? body.priceType
    : 'FREE'
  const priceCents = Number.isFinite(body.priceCents)
    ? Math.max(0, Math.floor(body.priceCents))
    : 0
  const slugSeed = String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const slug = `${slugSeed || 'listing'}-${randomUUID().slice(0, 8)}`

  const listing = await prisma.storeListing.create({
    data: {
      projectId,
      name,
      title: name,
      slug,
      description,
      priceType,
      priceCents,
      isPublished: true,
    },
  })

  await recordReward({
    userId: project.userId,
    sourceType: 'PUBLISH',
    sourceId: listing.id,
    amount: 100,
    currency: 'POINTS',
    description: `Publish reward for ${listing.title}`,
  const listing = await publishProjectListing({
    projectId,
    name,
    description,
    price: typeof price === 'number' ? price : undefined,
    pricingModel: isPricingModel(pricingModel) ? pricingModel : undefined,
  })

  return Response.json({ success: true, listing })
}
