import { NextResponse } from 'next/server'
import { syncPayoutAccount } from '@/server/services/payout-account.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (userId) {
    await syncPayoutAccount(userId)
  }

  return NextResponse.redirect(new URL('/dashboard/creator?payouts=connected', req.url))
}
