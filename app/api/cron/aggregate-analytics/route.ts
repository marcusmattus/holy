import { NextResponse } from 'next/server'
import { aggregateYesterdayAndTodayAnalytics } from '@/server/services/analytics-aggregation.service'
import { env } from '@/lib/env'
import { createHash, timingSafeEqual } from 'node:crypto'

function safeEquals(a: string, b: string) {
  const left = createHash('sha256').update(a).digest()
  const right = createHash('sha256').update(b).digest()

  return timingSafeEqual(left, right)
}

export async function POST(req: Request) {
  const headerSecret = req.headers.get('x-cron-secret')

  if (!env.CRON_SECRET || !headerSecret || !safeEquals(headerSecret, env.CRON_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await aggregateYesterdayAndTodayAnalytics()
  return NextResponse.json(result)
}
