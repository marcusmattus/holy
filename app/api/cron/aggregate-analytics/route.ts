import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { aggregateYesterdayAndToday } from '@/server/services/analytics-aggregation.service'
import { requireEnv } from '@/lib/env'

export async function POST(req: Request) {
  const { CRON_SECRET } = requireEnv(['CRON_SECRET'])
  const authHeader = req.headers.get('authorization')
  const provided = authHeader?.replace('Bearer ', '') ?? ''

  const expectedBuffer = Buffer.from(CRON_SECRET)
  const providedBuffer = Buffer.from(provided)
  const isValid =
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)

  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await aggregateYesterdayAndToday()
  return NextResponse.json({ ok: true, result })
}
