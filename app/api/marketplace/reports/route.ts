import { prisma } from '@/server/db/prisma'
import { getRequestContext } from '@/server/auth/request-context'

export async function POST(req: Request) {
  const { userId } = getRequestContext(req)
  const body = await req.json()

  if (!body.reason || typeof body.reason !== 'string') {
    return Response.json({ error: 'reason is required' }, { status: 400 })
  }
  if (!body.listingId && !body.templateId) {
    return Response.json({ error: 'listingId or templateId is required' }, { status: 400 })
  }

  const report = await prisma.marketplaceReport.create({
    data: {
      reporterId: userId,
      listingId: typeof body.listingId === 'string' ? body.listingId : null,
      templateId: typeof body.templateId === 'string' ? body.templateId : null,
      reason: body.reason,
      details: typeof body.details === 'string' ? body.details : null,
    },
  })

  return Response.json({ report })
}
