import { NextResponse } from 'next/server'
import { createDeployment } from '@/server/services/deployment.service'
import { logger } from '@/lib/logger'
import { checkRateLimit, getRequestRateLimitKey } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const limiter = checkRateLimit({
    key: getRequestRateLimitKey(req, 'deploy:create'),
    limit: 20,
    windowMs: 60_000,
  })
  if (!limiter.success) {
    return NextResponse.json({ error: 'Too many deployment requests' }, { status: 429 })
  }

  const body = await req.json()
  const { projectId, files, target, env } = body

  if (!projectId || typeof projectId !== 'string') {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
  }
  if (!files || typeof files !== 'object' || Object.keys(files).length === 0) {
    return NextResponse.json(
      { error: 'files is required and must not be empty' },
      { status: 400 },
    )
  }

  try {
    const deployment = await createDeployment({
      projectId,
      files,
      target,
      env,
    })

    return NextResponse.json({
      id: deployment.id,
      url: deployment.url,
      status: deployment.status,
      projectId,
      fileCount: Object.keys(files).length,
      logs: deployment.logs,
    })
  } catch (error) {
    logger.error('deployment_request_failed', {
      projectId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Deployment failed' },
      { status: 500 },
    )
  }
}
