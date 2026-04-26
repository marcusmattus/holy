import { NextResponse } from 'next/server'
import { createAgentCheckout } from '@/server/services/agent-payment.service'
import { getAgentListingBySlug } from '@/server/services/agent-marketplace.service'

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
    const checkout = await createAgentCheckout({
      agentListingId: listing.id,
      buyerId: body.buyerId ?? 'demo-user',
    })
    return NextResponse.json(checkout)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create checkout' },
      { status: 400 },
    )
  }
}
