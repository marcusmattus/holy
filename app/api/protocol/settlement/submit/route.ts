import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import {
  getSettlementMode,
  getSettlementProvider,
} from '@/server/protocol/settlement-registry'

function getUserId(req: Request) {
  return req.headers.get('x-user-id') ?? 'demo-user'
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    provider?: string
    amount?: number
    currency?: string
    recipient?: string
    approve?: boolean
    deploymentId?: string
  }

  if (!body.approve) {
    return NextResponse.json(
      { error: 'explicit approve=true is required' },
      { status: 400 },
    )
  }

  if (!body.provider || !body.amount || !body.currency || !body.recipient) {
    return NextResponse.json(
      { error: 'provider, amount, currency and recipient are required' },
      { status: 400 },
    )
  }

  const mode = getSettlementMode()
  if (mode === 'DISABLED') {
    return NextResponse.json(
      { error: 'settlement mode is disabled' },
      { status: 403 },
    )
  }

  const provider = getSettlementProvider(body.provider)
  let result
  try {
    result = await provider.submit(
      {
        amount: body.amount,
        currency: body.currency,
        recipient: body.recipient,
      },
      mode,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Settlement failed'
    return NextResponse.json({ error: message }, { status: 501 })
  }

  const submission = await prisma.settlementSubmission.create({
    data: {
      provider: body.provider,
      mode,
      amount: body.amount,
      currency: body.currency,
      approved: body.approve,
      deploymentId: body.deploymentId,
      submittedById: getUserId(req),
      txHash: result.txHash,
      preview: result,
    },
  })

  if (result.txHash) {
    await prisma.payout.create({
      data: {
        userId: getUserId(req),
        amount: body.amount,
        currency: body.currency,
        txHash: result.txHash,
        metadata: { submissionId: submission.id },
      },
    })
  }

  return NextResponse.json({ submission, result })
}
