import { NextResponse } from 'next/server'
import { getSlaMetrics, recordSlaMetric } from '@/server/services/sla-monitoring.service'

export async function GET() {
  const metrics = await getSlaMetrics()
  return NextResponse.json(metrics)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const metric = await recordSlaMetric({
      workspaceId: body.workspaceId,
      metric: body.metric,
      value: Number(body.value),
      unit: body.unit,
      metadata: body.metadata,
    })
    return NextResponse.json(metric, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to record SLA metric' },
      { status: 400 },
    )
  }
}
