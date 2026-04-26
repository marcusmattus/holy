import { NextResponse } from 'next/server'
import { runTenantMigrationJob } from '@/server/workers/tenant-migration.worker'

export async function POST(_req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params
  try {
    return NextResponse.json(await runTenantMigrationJob(runId))
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
