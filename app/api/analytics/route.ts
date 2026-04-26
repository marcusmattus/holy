import { AnalyticsEventName } from '@prisma/client'
import { getAnalyticsSummary, trackAnalyticsEvent } from '@/server/services/analytics.service'

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
    metadata:
      metadata && typeof metadata === 'object' && !Array.isArray(metadata)
        ? (metadata as Record<string, unknown>)
        : undefined,
  })

  return Response.json({ event })
}
