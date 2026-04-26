import { NextResponse } from 'next/server'
import { createDomainVerification } from '@/server/services/domain-verification.service'
import { getRequestWorkspaceId } from '@/server/services/request-context'
import { prisma } from '@/server/db'

export async function POST(request: Request) {
  const workspaceId = getRequestWorkspaceId(request)
  if (!workspaceId) {
    return NextResponse.json({ error: 'workspace header required' }, { status: 400 })
  }

  const body = await request.json()
  if (!body?.domain || typeof body.domain !== 'string') {
    return NextResponse.json({ error: 'domain is required' }, { status: 400 })
  }

  let whiteLabelSite = await prisma.whiteLabelSite.findFirst({
    where: { workspaceId },
  })

  if (!whiteLabelSite) {
    whiteLabelSite = await prisma.whiteLabelSite.create({
      data: {
        workspaceId,
        name: `${workspaceId}-site`,
      },
    })
  }

  const verification = await createDomainVerification({
    whiteLabelSiteId: whiteLabelSite.id,
    domain: body.domain,
  })

  return NextResponse.json(verification, { status: 201 })
}
