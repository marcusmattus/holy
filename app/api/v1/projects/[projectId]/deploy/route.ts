import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/server/security/api-key-auth'
import { prisma } from '@/server/db'
import { writeAuditLog } from '@/server/security/audit-log'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const auth = await authenticateApiKey(req, ['deployments:write'])
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { projectId } = await params
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: auth.userId },
  })
  if (!project) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const body = (await req.json()) as { target?: string }
  const target = body.target ?? 'preview'
  const deployment = await prisma.deployment.create({
    data: {
      projectId,
      userId: auth.userId,
      target,
      status: 'deployed',
      url: `https://holy-${projectId}-${target}.vercel.app`,
    },
  })

  await writeAuditLog({
    actorId: auth.userId,
    action: 'api.projects.deploy',
    targetType: 'Deployment',
    targetId: deployment.id,
    workspaceId: auth.workspaceId,
  })

  return NextResponse.json({ deployment })
}
