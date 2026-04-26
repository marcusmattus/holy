import { NextResponse } from 'next/server'
import { createPayoutOnboardingLink } from '@/server/services/payout-account.service'
import { checkRateLimit, getRequestRateLimitKey } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const limiter = checkRateLimit({
    key: getRequestRateLimitKey(req, 'payouts:connect:start'),
    limit: 20,
    windowMs: 60_000,
  })
  if (!limiter.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { userId } = await req.json()
    const url = await createPayoutOnboardingLink(userId)
    return NextResponse.json({ url })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to start onboarding' },
      { status: 400 },
    )
  }
}
