import { NextResponse } from 'next/server'
import { optimizeListing } from '@/server/services/listing-optimization.service'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ listingId: string }> },
) {
  const { listingId } = await params
  const optimization = await optimizeListing(listingId)
  return NextResponse.json(optimization)
}
