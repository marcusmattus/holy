import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'
import { enqueueGenerateJob } from '@/server/queues/generate.queue'
import { generateProjectFiles } from '@/server/services/generate.service'

function getRateLimitKey(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = req.headers.get('x-real-ip')?.trim()
  const connectIp = req.headers.get('cf-connecting-ip')?.trim()
  const candidateIp = connectIp || realIp || forwarded || 'anonymous'
  return `generate:${candidateIp}`
}

export async function POST(req: Request) {
  const limit = rateLimit(getRateLimitKey(req))
  if (!limit.ok) {
    return Response.json(
      { error: 'Too many requests', retryAfterSeconds: limit.retryAfterSeconds },
      { status: 429 },
    )
  }

  try {
    const { prompt, projectId } = await req.json()
    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'prompt is required' }, { status: 400 })
    }

    const result = await enqueueGenerateJob(() =>
      generateProjectFiles({
        prompt,
        projectId: typeof projectId === 'string' ? projectId : undefined,
      }),
    )

    return Response.json(result)
  } catch (err) {
    logger.error('Generate route failed', { error: String(err) })
    return Response.json({ error: 'Failed to generate project files' }, { status: 500 })
  }
}
