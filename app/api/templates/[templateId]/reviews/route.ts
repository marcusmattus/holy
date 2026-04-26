import { prisma } from '@/server/db/prisma'
import { getRequestContext } from '@/server/auth/request-context'
import { hasTemplateAccess } from '@/server/services/template-payment.service'

type RouteParams = {
  params: Promise<{ templateId: string }>
}

function isValidRating(rating: unknown): rating is number {
  return typeof rating === 'number' && rating >= 1 && rating <= 5
}

export async function GET(_: Request, { params }: RouteParams) {
  const { templateId } = await params
  const reviews = await prisma.templateReview.findMany({
    where: { templateId, status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json({ reviews })
}

export async function POST(req: Request, { params }: RouteParams) {
  const { templateId } = await params
  const { userId } = getRequestContext(req)
  const body = await req.json()
  if (!isValidRating(body.rating)) {
    return Response.json({ error: 'rating must be between 1 and 5' }, { status: 400 })
  }

  if (!(await hasTemplateAccess(templateId, userId))) {
    return Response.json({ error: 'Template access required before reviewing' }, { status: 403 })
  }

  const review = await prisma.templateReview.upsert({
    where: { templateId_userId: { templateId, userId } },
    create: {
      templateId,
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
