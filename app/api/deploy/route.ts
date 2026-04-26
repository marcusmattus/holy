export async function POST(req: Request) {
  const body = await req.json()
  const { projectId, files } = body

  if (!projectId || typeof projectId !== 'string') {
    return Response.json({ error: 'projectId is required' }, { status: 400 })
  }
  if (!files || typeof files !== 'object') {
    return Response.json({ error: 'files is required' }, { status: 400 })
  }

  // TODO: integrate Vercel API
  const fakeUrl = `https://holy-${projectId}.vercel.app`

  return Response.json({
    url: fakeUrl,
    status: 'deployed',
    projectId,
    fileCount: Object.keys(files).length,
  })
}
