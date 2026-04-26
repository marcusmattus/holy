import { NextResponse } from 'next/server'
import { createDeployment, pollDeploymentStatus } from '@/server/services/deployment.service'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const body = (await req.json()) as {
    projectId?: string
    files?: Record<string, string>
    target?: 'preview' | 'production'
    env?: Record<string, string>
    poll?: boolean
  }

  const { projectId, files, target, env, poll } = body

  if (!projectId || typeof projectId !== 'string') {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
  }

  if (!files || typeof files !== 'object' || Object.keys(files).length === 0) {
    return NextResponse.json({ error: 'files must be a non-empty object' }, { status: 400 })
  }

  const rateLimit = checkRateLimit({ key: `deploy:${projectId}`, limit: 20, windowMs: 60_000 })
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  try {
    const deployment = await createDeployment({ projectId, files, target, env })
    const latestStatus = poll ? await pollDeploymentStatus(deployment.deploymentId) : null

    return NextResponse.json({
      url: latestStatus?.url ?? deployment.url,
      status: latestStatus?.status ?? deployment.status,
      projectId,
      provider: deployment.provider,
      deploymentId: deployment.deploymentId,
      logs: latestStatus?.logs ?? deployment.logs,
      fileCount: Object.keys(files).length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Deployment failed' },
      { status: 500 },
    )
  }
}
