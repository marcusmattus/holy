import { NextResponse } from 'next/server'
import { assertAdmin } from '@/server/security'
import { listRuntimeClusterNodes } from '@/server/services/runtime-cluster.service'

export async function GET(request: Request) {
  try {
    assertAdmin(request)
    const nodes = await listRuntimeClusterNodes()
    return NextResponse.json({ nodes })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 403 })
  }
}
