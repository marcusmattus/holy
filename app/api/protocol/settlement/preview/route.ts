import { NextResponse } from 'next/server'
import {
  getSettlementMode,
  getSettlementProvider,
} from '@/server/protocol/settlement-registry'

export async function POST(req: Request) {
  const body = (await req.json()) as {
    provider?: string
    amount?: number
    currency?: string
    recipient?: string
  }

  if (!body.provider || !body.amount || !body.currency || !body.recipient) {
    return NextResponse.json(
      { error: 'provider, amount, currency and recipient are required' },
      { status: 400 },
    )
  }

  const mode = getSettlementMode()
  const provider = getSettlementProvider(body.provider)
  const preview = await provider.preview(
    {
      amount: body.amount,
      currency: body.currency,
      recipient: body.recipient,
    },
    mode,
  )

  return NextResponse.json({ preview })
}
