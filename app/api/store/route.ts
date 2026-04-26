import { NextResponse } from 'next/server'
import { listPublishedListings } from '@/server/services/store.service'

export async function GET() {
  const listings = await listPublishedListings()
  return NextResponse.json({ listings })
}
