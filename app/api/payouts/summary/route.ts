import { NextResponse } from 'next/server'
import { getPayoutSummary } from '@/server/services/payout.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const summary = await getPayoutSummary(userId)
  return NextResponse.json(summary)
}
