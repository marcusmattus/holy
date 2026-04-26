import { prisma } from '@/server/db/prisma'
import { getRequestContext } from '@/server/auth/request-context'

export async function GET(req: Request) {
  const { isAdmin } = getRequestContext(req)
  if (!isAdmin) {
    return Response.json({ error: 'Admin access required' }, { status: 403 })
  }

  const reports = await prisma.marketplaceReport.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return Response.json({ reports })
}
