import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/server/security/api-key-auth'
import { prisma } from '@/server/db'
import { writeAuditLog } from '@/server/security/audit-log'

export async function GET(req: Request) {
  const auth = await authenticateApiKey(req, ['projects:read'])
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const projects = await prisma.project.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ projects })
}

export async function POST(req: Request) {
  const auth = await authenticateApiKey(req, ['projects:write'])
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await req.json()) as { name?: string; prompt?: string }
  if (!body.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      userId: auth.userId,
      name: body.name,
    },
  })

  if (body.prompt) {
    await prisma.projectVersion.create({
      data: {
        projectId: project.id,
        label: 'initial-prompt',
        code: JSON.stringify({ prompt: body.prompt }),
      },
    })
  }

  await writeAuditLog({
    actorId: auth.userId,
    action: 'api.projects.create',
    targetType: 'Project',
    targetId: project.id,
    workspaceId: auth.workspaceId,
  })

  return NextResponse.json({ project }, { status: 201 })
}
