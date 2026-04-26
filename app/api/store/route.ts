import { installListing, listPublishedListings } from '@/server/services/store.service'

export async function GET() {
  const listings = await listPublishedListings()
  return Response.json({ listings })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { listingId, projectId, userId, source } = body

  if (!listingId || typeof listingId !== 'string') {
    return Response.json({ error: 'listingId is required' }, { status: 400 })
  }
  if (!projectId || typeof projectId !== 'string') {
    return Response.json({ error: 'projectId is required' }, { status: 400 })
  }

  const install = await installListing({
    listingId,
    projectId,
    userId: typeof userId === 'string' ? userId : undefined,
    source: typeof source === 'string' ? source : undefined,
  })

  return Response.json({ install })
}
