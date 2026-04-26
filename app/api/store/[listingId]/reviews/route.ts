import { prisma } from '@/server/db/prisma'
import { getRequestContext } from '@/server/auth/request-context'

type RouteParams = {
  params: Promise<{ listingId: string }>
}

function isValidRating(rating: unknown): rating is number {
  return typeof rating === 'number' && rating >= 1 && rating <= 5
}

export async function GET(_: Request, { params }: RouteParams) {
  const { listingId } = await params
  const reviews = await prisma.storeReview.findMany({
    where: { listingId, status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json({ reviews })
}

export async function POST(req: Request, { params }: RouteParams) {
  const { listingId } = await params
  const { userId } = getRequestContext(req)
  const body = await req.json()
  if (!isValidRating(body.rating)) {
    return Response.json({ error: 'rating must be between 1 and 5' }, { status: 400 })
  }

  const listing = await prisma.storeListing.findUnique({ where: { id: listingId } })
  if (!listing) {
    return Response.json({ error: 'Listing not found' }, { status: 404 })
  }

  const review = await prisma.storeReview.upsert({
    where: { listingId_userId: { listingId, userId } },
    create: {
      listingId,
      userId,
      rating: body.rating,
      body: typeof body.body === 'string' ? body.body : null,
    },
    update: {
      rating: body.rating,
      body: typeof body.body === 'string' ? body.body : null,
      status: 'PUBLISHED',
    },
  })

  return Response.json({ review })
}
