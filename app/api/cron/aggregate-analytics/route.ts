import { NextResponse } from 'next/server'
import { aggregateYesterdayAndTodayAnalytics } from '@/server/services/analytics-aggregation.service'
import { env } from '@/lib/env'

export async function POST(req: Request) {
  const headerSecret = req.headers.get('x-cron-secret')

  if (!env.CRON_SECRET || headerSecret !== env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await aggregateYesterdayAndTodayAnalytics()
  return NextResponse.json(result)
}
