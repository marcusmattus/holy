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

  const listing = await publishProjectListing({
    projectId,
    name,
    description,
    price: typeof price === 'number' ? price : undefined,
    pricingModel: isPricingModel(pricingModel) ? pricingModel : undefined,
  })

  return Response.json({ success: true, listing })
}
