import { NextResponse } from 'next/server'
import { requestCreatorPayout } from '@/server/services/payout.service'
import { checkRateLimit, getRequestRateLimitKey } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  const limiter = checkRateLimit({
    key: getRequestRateLimitKey(req, 'payouts:request'),
    limit: 8,
    windowMs: 60_000,
  })
  if (!limiter.success) {
    return NextResponse.json({ error: 'Too many payout requests' }, { status: 429 })
  }

  try {
    const { userId } = await req.json()
    const payout = await requestCreatorPayout(userId)
    logger.info('payout_requested', {
      userId,
      payoutId: payout.id,
      status: payout.status,
      amountCents: payout.amountCents,
    })
    return NextResponse.json({ payout })
  } catch (error) {
    logger.error('payout_request_failed', {
      error: error instanceof Error ? error.message : 'Unknown payout error',
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payout failed' },
      { status: 400 },
    )
  }
}
