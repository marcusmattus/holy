import { prisma } from '@/server/db/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const { projectId, name, description, price } = body

  if (!projectId || typeof projectId !== 'string') {
    return Response.json({ error: 'projectId is required' }, { status: 400 })
  }
  if (!name || typeof name !== 'string') {
    return Response.json({ error: 'name is required' }, { status: 400 })
  }
  if (!description || typeof description !== 'string') {
    return Response.json({ error: 'description is required' }, { status: 400 })
  }

  const latestQaRun = await prisma.qaRun.findFirst({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  })

  if (!latestQaRun) {
    return Response.json({ error: 'QA run is required before publish' }, { status: 400 })
  }

  if (latestQaRun.status === 'FAIL') {
    return Response.json(
      {
        error: `QA checks failed. Review the latest run via /api/projects/${projectId}/qa/run before publishing.`,
      },
      { status: 400 }
    )
  }

  const listing = await prisma.storeListing.create({
    data: {
      projectId,
      name,
      description,
      price: typeof price === 'number' ? price : null,
      isPublished: true,
    },
  })

  return Response.json({ success: true, listing })
}
