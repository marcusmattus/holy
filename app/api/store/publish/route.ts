export async function POST(req: Request) {
  const body = await req.json()
  const { projectId, name, description } = body

  if (!projectId || typeof projectId !== 'string') {
    return Response.json({ error: 'projectId is required' }, { status: 400 })
  }
  if (!name || typeof name !== 'string') {
    return Response.json({ error: 'name is required' }, { status: 400 })
  }
  if (!description || typeof description !== 'string') {
    return Response.json({ error: 'description is required' }, { status: 400 })
  }

  // TODO: persist listing to database

  return Response.json({ success: true, projectId, name, description })
}
