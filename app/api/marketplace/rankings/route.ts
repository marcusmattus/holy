import { NextResponse } from 'next/server'
import { rankMarketplaceAssets } from '@/server/marketplace/ranking/ranking-engine'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({ assets: [] }))
  const rankings = rankMarketplaceAssets(body.assets ?? [])
  return NextResponse.json({ rankings })
}
