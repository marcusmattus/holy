import { saveProject } from '@/server/services/studio-project.service'

export async function POST(req: Request) {
  const body = await req.json()

  if (!body.id || !body.manifest) {
    return Response.json({ error: 'Invalid project' }, { status: 400 })
  }

  const project = saveProject(body)

  return Response.json({ project })
}
