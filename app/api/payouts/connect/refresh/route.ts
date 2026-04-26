import { NextResponse } from 'next/server'
import { createPayoutOnboardingLink } from '@/server/services/payout-account.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const url = await createPayoutOnboardingLink(userId)
  return NextResponse.redirect(url)
}
