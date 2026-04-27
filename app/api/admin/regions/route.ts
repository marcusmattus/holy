import { NextResponse } from 'next/server'
import { listRegions, registerRegion } from '@/server/regions/regional-control-plane'
import { getRegionHealth } from '@/server/regions/region-health.service'

export async function GET() {
  return NextResponse.json({ regions: listRegions(), health: getRegionHealth() })
}

export async function POST(req: Request) {
  const body = await req.json()
  const region = registerRegion(body.region, body.name, body.priority)
  return NextResponse.json(region)
}
