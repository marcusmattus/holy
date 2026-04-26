import { AnalyticsEventName } from '@prisma/client'
import { getAnalyticsSummary, trackAnalyticsEvent } from '@/server/services/analytics.service'

const MAX_METADATA_BYTES = 8_192
const MAX_METADATA_DEPTH = 4

function hasSafeDepth(value: unknown, depth = 0): boolean {
  if (depth > MAX_METADATA_DEPTH) {
    return false
  }
  if (value === null || typeof value !== 'object') {
    return true
  }
  if (Array.isArray(value)) {
    return value.every((item) => hasSafeDepth(item, depth + 1))
  }
  return Object.values(value).every((item) => hasSafeDepth(item, depth + 1))
}

function sanitizeMetadata(metadata: unknown): Record<string, unknown> | undefined {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return undefined
  }
  if (!hasSafeDepth(metadata)) {
    return undefined
  }

  const serialized = JSON.stringify(metadata)
  if (serialized.length > MAX_METADATA_BYTES) {
    return undefined
  }

  return metadata as Record<string, unknown>
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('projectId') ?? undefined
  const summary = await getAnalyticsSummary(projectId)
  return Response.json({ summary })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { eventName, userId, projectId, listingId, source, metadata } = body

  if (!eventName || !Object.values(AnalyticsEventName).includes(eventName as AnalyticsEventName)) {
    return Response.json({ error: 'valid eventName is required' }, { status: 400 })
  }

  const event = await trackAnalyticsEvent({
    eventName: eventName as AnalyticsEventName,
    userId: typeof userId === 'string' ? userId : undefined,
    projectId: typeof projectId === 'string' ? projectId : undefined,
    listingId: typeof listingId === 'string' ? listingId : undefined,
    source: typeof source === 'string' ? source : undefined,
    metadata: sanitizeMetadata(metadata),
  })

  return Response.json({ event })
}
