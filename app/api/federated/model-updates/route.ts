import { NextResponse } from 'next/server'
import { finalizeFederatedRound, submitFederatedModelUpdate } from '@/server/services/federated-intelligence.service'

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const update = submitFederatedModelUpdate(body)
    const maybeSummary = body.finalizeRound ? finalizeFederatedRound(body.roundId) : null
    return NextResponse.json({ update, summary: maybeSummary })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
