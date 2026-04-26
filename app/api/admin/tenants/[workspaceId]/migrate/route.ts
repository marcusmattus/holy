import { NextResponse } from 'next/server'
import { executeTenantMigration } from '@/server/services/tenant-migration.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const body = await req.json().catch(() => ({}))
  const { workspaceId } = await params
  const migration = await executeTenantMigration({
    workspaceId,
    destinationRegion: body.destinationRegion,
    approvedById: body.approvedById ?? 'admin-user',
    dryRun: body.dryRun,
  })

  return NextResponse.json({ migration })
}
