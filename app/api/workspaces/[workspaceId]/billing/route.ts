import { NextResponse } from 'next/server'
import { BillingStatus, WorkspacePlan } from '@prisma/client'
import {
  getWorkspaceBillingAccount,
  upsertWorkspaceBillingAccount,
} from '@/server/services/usage-meter.service'

export async function GET(_: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params
  const billing = await getWorkspaceBillingAccount(workspaceId)
  return NextResponse.json({ billing })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  const body = await req.json()

  if (body.plan && !Object.values(WorkspacePlan).includes(body.plan)) {
    return NextResponse.json({ error: 'invalid plan' }, { status: 400 })
  }

  if (body.status && !Object.values(BillingStatus).includes(body.status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 })
  }

  const billing = await upsertWorkspaceBillingAccount({
    workspaceId,
    plan: body.plan,
    status: body.status,
  })

  return NextResponse.json({ billing })
}
