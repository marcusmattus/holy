import { NextResponse } from 'next/server'
import { createAutonomyRun, listAutonomyRuns } from '@/server/services/autonomous-intelligence.service'
import { getRequestIdentity } from '@/server/security'

export async function GET() {
  const runs = await listAutonomyRuns()
  return NextResponse.json({ runs })
}

export async function POST(request: Request) {
  const identity = getRequestIdentity(request)
  const body = (await request.json()) as {
    workspaceId: string
    action: string
    workspaceAllowsPreviewDeploy?: boolean
  }

  const run = await createAutonomyRun({
    workspaceId: body.workspaceId,
    action: body.action,
    initiatedById: identity.userId,
    workspaceAllowsPreviewDeploy: body.workspaceAllowsPreviewDeploy,
  })

  return NextResponse.json({ run })
}
