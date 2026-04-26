import { NextResponse } from 'next/server'
import { createPayoutOnboardingLink } from '@/server/services/payout-account.service'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const { userId } = (await req.json()) as { userId?: string }

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const rateLimit = checkRateLimit({ key: `payout-connect-start:${userId}`, limit: 10, windowMs: 60_000 })
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const url = await createPayoutOnboardingLink(userId)
  return NextResponse.json({ url })
}
