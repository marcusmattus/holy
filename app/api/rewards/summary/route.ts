import { NextResponse } from 'next/server'
import { getRewardSummary } from '@/server/services/reward-ledger.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const summary = await getRewardSummary(userId)
  return NextResponse.json({ summary })
}
