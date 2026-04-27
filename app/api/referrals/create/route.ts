import { NextResponse } from 'next/server'
import { createReferralLink } from '@/server/services/growth.service'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))

  if (!body.referrerId || typeof body.referrerId !== 'string') {
    return NextResponse.json({ error: 'referrerId is required' }, { status: 400 })
  }

  const data = await createReferralLink({
    referrerId: body.referrerId,
    listingId: typeof body.listingId === 'string' ? body.listingId : undefined,
  }).catch(() => null)

  if (!data) {
    return NextResponse.json({ error: 'Unable to create referral link' }, { status: 503 })
  }

  return NextResponse.json(data)
}
