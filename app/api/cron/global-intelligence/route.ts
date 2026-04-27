import { NextResponse } from 'next/server'
import { runGlobalIntelligenceAggregationJob } from '@/server/workers/global-intelligence.worker'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({ signals: [] }))
  const result = await runGlobalIntelligenceAggregationJob(body.signals ?? [])
  return NextResponse.json(result)
}
