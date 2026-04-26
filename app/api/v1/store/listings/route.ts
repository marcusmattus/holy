import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/server/security/api-key-auth'
import { prisma } from '@/server/db'

export async function GET(req: Request) {
  const auth = await authenticateApiKey(req, ['store:listings:read'])
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const listings = await prisma.storeListing.findMany({
    where: {
      project: { userId: auth.userId },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ listings })
}
