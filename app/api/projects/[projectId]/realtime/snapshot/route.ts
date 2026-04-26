import { getRequestContext } from '@/server/auth/request-context'
import { saveRealtimeSnapshot } from '@/server/services/realtime-collaboration.service'

type RouteParams = {
  params: Promise<{ projectId: string }>
}

export async function POST(req: Request, { params }: RouteParams) {
  const { projectId } = await params
  const { userId } = getRequestContext(req)
  const body = await req.json()

  if (!body.filePath || typeof body.filePath !== 'string') {
    return Response.json({ error: 'filePath is required' }, { status: 400 })
  }
  if (typeof body.content !== 'string') {
    return Response.json({ error: 'content is required' }, { status: 400 })
  }

  try {
    const snapshot = await saveRealtimeSnapshot(projectId, userId, body.filePath, body.content)
    return Response.json({ snapshotId: snapshot.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save snapshot'
    return Response.json({ error: message }, { status: 403 })
  }
}
