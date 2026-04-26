import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/server/security/api-key-auth'
import { prisma } from '@/server/db'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const auth = await authenticateApiKey(req, ['projects:read'])
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { projectId } = await params
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: auth.userId },
    include: { versions: { orderBy: { createdAt: 'desc' }, take: 10 } },
  })

  if (!project) return NextResponse.json({ error: 'not found' }, { status: 404 })

  return NextResponse.json({ project })
}
