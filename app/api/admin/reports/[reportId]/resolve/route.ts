import { prisma } from '@/server/db/prisma'
import { getRequestContext } from '@/server/auth/request-context'

type RouteParams = {
  params: Promise<{ reportId: string }>
}

export async function POST(req: Request, { params }: RouteParams) {
  const { isAdmin } = getRequestContext(req)
  if (!isAdmin) {
    return Response.json({ error: 'Admin access required' }, { status: 403 })
  }

  const { reportId } = await params
  const body = await req.json()
  const action = body.action as 'HIDE_LISTING' | 'REMOVE_TEMPLATE' | 'DISMISS'

  const report = await prisma.marketplaceReport.findUnique({ where: { id: reportId } })
  if (!report) {
    return Response.json({ error: 'Report not found' }, { status: 404 })
  }

  if (action === 'HIDE_LISTING' && report.listingId) {
    await prisma.storeListing.update({
      where: { id: report.listingId },
      data: { isPublished: false },
    })
  }
  if (action === 'REMOVE_TEMPLATE' && report.templateId) {
    await prisma.template.update({
      where: { id: report.templateId },
      data: { isPublished: false },
    })
  }

  const updated = await prisma.marketplaceReport.update({
    where: { id: reportId },
    data: { status: action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED' },
  })

  return Response.json({ report: updated })
}
