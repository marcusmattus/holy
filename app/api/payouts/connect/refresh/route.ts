import { NextResponse } from 'next/server'
import { createPayoutOnboardingLink } from '@/server/services/payout-account.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  try {
    const url = await createPayoutOnboardingLink(userId)
    return NextResponse.redirect(new URL(url))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to refresh onboarding' },
      { status: 400 },
    )
  }
}
