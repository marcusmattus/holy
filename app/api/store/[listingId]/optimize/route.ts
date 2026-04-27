import { NextResponse } from 'next/server'
import { getStoreListingByIdentifier } from '@/server/services/store-listing.service'
import { optimizeListing } from '@/server/services/listing-optimization.service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ listingId: string }> },
) {
  const { listingId } = await params
  const listing = await getStoreListingByIdentifier(listingId)
  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }
  const optimization = optimizeListing(listing)
  return NextResponse.json(optimization)
}
