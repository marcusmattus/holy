import { NextResponse } from 'next/server'
import type { DataRegion, RuntimeProvider } from '@prisma/client'
import { upsertRuntimeHeartbeat } from '@/server/services/runtime-cluster.service'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      provider: RuntimeProvider
      region: DataRegion
      endpoint: string
      capacity?: number
      activeJobs?: number
      metadata?: Record<string, unknown>
      token: string
    }

    const node = await upsertRuntimeHeartbeat(body)
    return NextResponse.json({ ok: true, node })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'invalid request' }, { status: 400 })
  }
}
