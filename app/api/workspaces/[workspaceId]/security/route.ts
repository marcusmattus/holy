import { WorkspaceRole } from '@prisma/client'
import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { requireWorkspaceRole } from '@/server/security/permissions'
import { writeAuditLog } from '@/server/security/audit-log'

function getUserId(req: Request) {
  return req.headers.get('x-user-id') ?? 'demo-user'
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  const allowed = await requireWorkspaceRole(workspaceId, getUserId(req), WorkspaceRole.MEMBER)
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const security = await prisma.workspaceSecuritySettings.findUnique({
    where: { workspaceId },
  })

  return NextResponse.json({ security })
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const userId = getUserId(req)
  const { workspaceId } = await params
  const allowed = await requireWorkspaceRole(workspaceId, userId, WorkspaceRole.ADMIN)
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const body = (await req.json()) as {
    enforce2fa?: boolean
    allowedDomains?: string[]
    apiAccessEnabled?: boolean
  }

  const security = await prisma.workspaceSecuritySettings.upsert({
    where: { workspaceId },
    create: {
      workspaceId,
      enforce2fa: body.enforce2fa ?? false,
      allowedDomains: body.allowedDomains ?? [],
      apiAccessEnabled: body.apiAccessEnabled ?? true,
    },
    update: {
      enforce2fa: body.enforce2fa,
      allowedDomains: body.allowedDomains,
      apiAccessEnabled: body.apiAccessEnabled,
    },
  })

  await writeAuditLog({
    actorId: userId,
    workspaceId,
    action: 'workspace.security.updated',
    targetType: 'WorkspaceSecuritySettings',
    targetId: security.id,
  })

  return NextResponse.json({ security })
}
