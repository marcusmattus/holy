import { WorkspaceRole } from '@prisma/client'
import { createHash, randomBytes } from 'crypto'
import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { requireWorkspaceRole } from '@/server/security/permissions'
import { writeAuditLog } from '@/server/security/audit-log'

const INVITE_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000

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

  const invites = await prisma.workspaceInvite.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ invites })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const userId = getUserId(req)
  const { workspaceId } = await params
  const allowed = await requireWorkspaceRole(workspaceId, userId, WorkspaceRole.ADMIN)
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const body = (await req.json()) as { email?: string; role?: WorkspaceRole }
  if (!body.email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

  const token = randomBytes(24).toString('hex')
  const invite = await prisma.workspaceInvite.create({
    data: {
      workspaceId,
      email: body.email,
      role: body.role ?? WorkspaceRole.MEMBER,
      tokenHash: createHash('sha256').update(token).digest('hex'),
      createdById: userId,
      expiresAt: new Date(Date.now() + INVITE_EXPIRATION_MS),
    },
  })

  await writeAuditLog({
    actorId: userId,
    workspaceId,
    action: 'workspace.invite.created',
    targetType: 'WorkspaceInvite',
    targetId: invite.id,
    metadata: { email: body.email, role: invite.role },
  })

  return NextResponse.json(
    {
      invite,
      delivery: {
        status: 'pending',
        message: 'Invite token should be delivered through a secure channel.',
      },
    },
    { status: 201 },
  )
}
