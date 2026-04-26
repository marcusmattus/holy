import { WorkspaceRole } from '@prisma/client'
import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { requireWorkspaceRole } from '@/server/security/permissions'

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

  const logs = await prisma.workspaceAuditLog.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return NextResponse.json({ logs })
}
