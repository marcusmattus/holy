import { NextResponse } from 'next/server'
import { installAgentListing, getAgentListingBySlug } from '@/server/services/agent-marketplace.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const listing = await getAgentListingBySlug(slug)
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    const body = await req.json()
    const result = await installAgentListing({
      agentListingId: listing.id,
      userId: body.userId ?? 'demo-user',
      workspaceId: body.workspaceId,
      config: body.config,
    })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to install agent' },
      { status: 400 },
    )
  }
}
