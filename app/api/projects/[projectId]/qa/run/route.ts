import { getRequestContext } from '@/server/auth/request-context'
import { runQaPipeline } from '@/server/qa/qa-runner'

type RouteParams = {
  params: Promise<{ projectId: string }>
}

export async function POST(req: Request, { params }: RouteParams) {
  const { projectId } = await params
  const { userId } = getRequestContext(req)
  const body = await req.json()

  if (!body.files || typeof body.files !== 'object') {
    return Response.json({ error: 'files object is required' }, { status: 400 })
  }

  if (body.ownerId && body.ownerId !== userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const qaRun = await runQaPipeline(projectId, body.files as Record<string, string>)
  return Response.json({ qaRun })
}
