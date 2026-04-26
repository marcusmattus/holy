import { NextResponse } from 'next/server'
import { getAgentListingBySlug } from '@/server/services/agent-marketplace.service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const listing = await getAgentListingBySlug(slug)
  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(listing)
}
