import { getRequestContext } from '@/server/auth/request-context'
import { ensureRealtimeRoom, getRealtimeRoom } from '@/server/services/realtime-collaboration.service'

type RouteParams = {
  params: Promise<{ projectId: string }>
}

export async function GET(req: Request, { params }: RouteParams) {
  const { projectId } = await params
  const { userId } = getRequestContext(req)
  try {
    const room = await getRealtimeRoom(projectId, userId)
    return Response.json({ room })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to get room'
    return Response.json({ error: message }, { status: 403 })
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  const { projectId } = await params
  const { userId } = getRequestContext(req)
  try {
    const room = await ensureRealtimeRoom(projectId, userId)
    return Response.json({ room })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create room'
    return Response.json({ error: message }, { status: 403 })
  }
}
