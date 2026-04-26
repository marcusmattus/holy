import { WorkspaceRole } from '@prisma/client'
import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { requireWorkspaceRole } from '@/server/security/permissions'
import type { Prisma } from '@prisma/client'

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

  const sites = await prisma.whiteLabelSite.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ sites })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  const userId = getUserId(req)
  const allowed = await requireWorkspaceRole(workspaceId, userId, WorkspaceRole.ADMIN)
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const body = (await req.json()) as {
    name?: string
    domain?: string
    logoUrl?: string
    primaryColor?: string
    themeConfig?: Record<string, unknown>
  }

  if (!body.name || !body.domain) {
    return NextResponse.json(
      { error: 'name and domain are required' },
      { status: 400 },
    )
  }

  const site = await prisma.whiteLabelSite.create({
    data: {
      workspaceId,
      name: body.name,
      domain: body.domain,
      logoUrl: body.logoUrl,
      primaryColor: body.primaryColor,
      themeConfig: (body.themeConfig ?? {}) as Prisma.InputJsonValue,
    },
  })

  return NextResponse.json({ site }, { status: 201 })
}
