import { installPlugin } from '@/server/services/plugin.service'

export async function POST(req: Request, context: { params: Promise<{ pluginId: string }> }) {
  const { pluginId } = await context.params
  const body = await req.json()

  const projectId = typeof body.projectId === 'string' ? body.projectId : ''
  const installedById = typeof body.installedById === 'string' ? body.installedById : ''

  if (!projectId || !installedById) {
    return Response.json({ error: 'projectId and installedById are required' }, { status: 400 })
  }

  const result = installPlugin(pluginId, projectId, installedById)
  if (!result.success) {
    return Response.json(result, { status: 404 })
  }

  return Response.json(result)
}
