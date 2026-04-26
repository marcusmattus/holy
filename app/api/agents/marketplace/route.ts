import { NextResponse } from 'next/server'
import {
  listPublishedAgentListings,
  publishAgentListing,
} from '@/server/services/agent-marketplace.service'

export async function GET() {
  const listings = await listPublishedAgentListings()
  return NextResponse.json(listings)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const listing = await publishAgentListing({
      creatorId: body.creatorId ?? 'demo-user',
      title: body.title,
      slug: body.slug,
      description: body.description ?? '',
      category: body.category,
      type: body.type,
      configSchema: body.configSchema,
      defaultConfig: body.defaultConfig,
      priceType: body.priceType,
      priceCents: body.priceCents,
    })
    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to publish listing' },
      { status: 400 },
    )
  }
}
