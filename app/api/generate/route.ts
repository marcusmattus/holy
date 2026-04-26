import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'
import { enqueueGenerateJob } from '@/server/queues/generate.queue'
import { generateProjectFiles } from '@/server/services/generate.service'

export async function POST(req: Request) {
  const key = req.headers.get('x-forwarded-for') ?? 'anonymous'
  const limit = rateLimit(`generate:${key}`)
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
