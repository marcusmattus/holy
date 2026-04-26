import { NextResponse } from 'next/server'
import { verifyDomain } from '@/server/services/domain-verification.service'
import { getRequestWorkspaceId } from '@/server/services/request-context'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ domain: string }> },
) {
  const workspaceId = getRequestWorkspaceId(request)
  if (!workspaceId) {
    return NextResponse.json({ error: 'workspace header required' }, { status: 400 })
  }

  const { domain } = await params
  const body = await request.json().catch(() => ({}))
  const result = await verifyDomain({ workspaceId, domain, txtValue: body?.txtValue })

  return NextResponse.json(result)
}
