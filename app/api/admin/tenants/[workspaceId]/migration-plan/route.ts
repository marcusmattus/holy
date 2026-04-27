import { NextResponse } from 'next/server'
import { planTenantMigration } from '@/server/services/tenant-migration.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const body = await req.json().catch(() => ({}))
  const { workspaceId } = await params
  const plan = await planTenantMigration({
    workspaceId,
    destinationRegion: body.destinationRegion,
    strictMode: body.strictMode,
    estimatedDataGb: body.estimatedDataGb,
    includeSettlementData: body.includeSettlementData,
  })

  return NextResponse.json({ plan })
}
