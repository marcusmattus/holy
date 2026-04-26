import { NextResponse } from 'next/server'
import { approveTenantMigration } from '@/server/data-region/tenant-migration-executor'

export async function POST(req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params
  const body = await req.json()
  try {
    return NextResponse.json(
      approveTenantMigration(runId, body.adminId, body.enterpriseOwnerApprovalId),
    )
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
