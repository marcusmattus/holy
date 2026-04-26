import { NextResponse } from 'next/server'
import { createTenantMigrationRun, dryRunTenantMigration } from '@/server/data-region/tenant-migration-executor'

export async function POST(req: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params
  const body = await req.json()
  try {
    const run = createTenantMigrationRun(workspaceId, body.fromRegion, body.toRegion, body.strictMode ?? true)
    const dryRun = body.runDryRun ? dryRunTenantMigration(run.id) : null
    return NextResponse.json({ run, dryRun })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
