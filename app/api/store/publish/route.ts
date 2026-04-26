import { prisma } from '@/server/db/client'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
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

  const listing = await prisma.storeListing.create({
    data: {
      projectId,
      name,
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      description,
      price: typeof price === 'number' ? price : 0,
      isPublished: true,
    },
  }).catch(() => null)

  if (!listing) {
    return Response.json({ error: 'Unable to publish listing' }, { status: 503 })
  }

  return Response.json({ listing })
}
