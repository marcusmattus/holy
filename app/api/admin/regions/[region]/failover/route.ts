import { NextResponse } from 'next/server'
import { executeFailover, proposeFailover } from '@/server/services/regional-operations.service'

export async function POST(req: Request, { params }: { params: Promise<{ region: string }> }) {
  const { region } = await params
  const body = await req.json()
  try {
    const proposal = proposeFailover(region as never, body.reason ?? 'degraded-region', body.toRegion)
    if (body.execute) {
      const executed = executeFailover(proposal.id, body.approvedById)
      return NextResponse.json({ proposal, executed })
    }
    return NextResponse.json({ proposal })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
