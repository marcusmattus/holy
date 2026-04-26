import { NextResponse } from 'next/server'
import { executeSettlementBatch } from '@/server/protocol/settlement-executor'
import { enqueueSettlementBatch } from '@/server/workers/settlement.worker'
import { assertAdmin } from '@/server/security'

export async function POST(
  request: Request,
  context: { params: Promise<{ batchId: string }> },
) {
  try {
    assertAdmin(request)
    const { batchId } = await context.params
    const body = (await request.json()) as {
      provider: string
      amountCents: number
      approved: boolean
      creatorOptIn: boolean
      dryRun?: boolean
    }

    const dryRunResult = await executeSettlementBatch({
      batchId,
      provider: body.provider,
      amountCents: body.amountCents,
      approved: body.approved,
      creatorOptIn: body.creatorOptIn,
      dryRun: true,
    })

    if (body.dryRun ?? false) {
      return NextResponse.json({ settlement: dryRunResult })
    }

    enqueueSettlementBatch({
      batchId,
      provider: body.provider,
      amountCents: body.amountCents,
      approved: body.approved,
      creatorOptIn: body.creatorOptIn,
    })

    return NextResponse.json({ settlement: { batchId, status: 'queued', preflight: dryRunResult } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Settlement execution failed' }, { status: 400 })
  }
}
