import { NextResponse } from 'next/server'
import { getRankedListings } from '@/server/services/store-ranking.service'

export async function GET() {
  const listings = await getRankedListings()
  return NextResponse.json({ listings })
}
