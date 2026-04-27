import { NextResponse } from 'next/server'
import { createFederatedRound, listFederatedRounds } from '@/server/services/federated-intelligence.service'

export async function GET() {
  return NextResponse.json({ rounds: listFederatedRounds() })
}

export async function POST(req: Request) {
  const body = await req.json()
  const round = createFederatedRound(body.name, body.target, body.minSampleSize, body.enterpriseOptOutWorkspaceIds)
  return NextResponse.json(round)
}
