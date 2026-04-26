import { NextResponse } from 'next/server'
import { getMetrics } from '@/server/observability/metrics'
import { evaluateAlert } from '@/server/observability/alerts'
import { listAuditLogs } from '@/server/observability/logger'
import { requireAdmin } from '@/server/services/access-control.service'

export async function GET(req: Request) {
  try {
    requireAdmin(req.headers, 'observability.read')
    const metrics = getMetrics()
    const alerts = Object.entries(metrics).map(([name, value]) => evaluateAlert(name, value))
    return NextResponse.json({ metrics, alerts, audit: listAuditLogs().slice(-50) })
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
}
