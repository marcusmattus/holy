import { NextResponse } from 'next/server'
import { assertAdmin } from '@/server/security'
import { listWorkerPools } from '@/server/services/worker-autoscaler.service'

export async function GET(request: Request) {
  try {
    assertAdmin(request)
    const pools = await listWorkerPools()
    return NextResponse.json({ pools })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 403 })
  }
}
