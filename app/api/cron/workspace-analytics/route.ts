import { NextResponse } from 'next/server'
import { rebuildWorkspaceAnalyticsDaily } from '@/server/services/workspace-analytics.service'

export async function POST(req: Request) {
  const providedSecret = req.headers.get('x-cron-secret')
  const expectedSecret = process.env.CRON_SECRET
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await rebuildWorkspaceAnalyticsDaily()
  return NextResponse.json(result)
}
