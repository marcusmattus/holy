import { NextResponse } from 'next/server'
import { requestCreatorPayout } from '@/server/services/payout.service'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const { userId } = (await req.json()) as { userId?: string }

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const rateLimit = checkRateLimit({ key: `payout-request:${userId}`, limit: 5, windowMs: 60_000 })
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const payout = await requestCreatorPayout(userId)
  return NextResponse.json({ payout })
}
