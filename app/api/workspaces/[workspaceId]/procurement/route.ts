import { NextResponse } from 'next/server'
import { approveProcurementRequest, createProcurementRequest } from '@/server/services/procurement.service'
import { getRequestIdentity } from '@/server/security'

export async function POST(
  request: Request,
  context: { params: Promise<{ workspaceId: string }> },
) {
  const identity = getRequestIdentity(request)
  const { workspaceId } = await context.params
  const body = (await request.json()) as {
    action?: 'create' | 'approve'
    procurementId?: string
    assetType?: 'STORE_LISTING' | 'TEMPLATE' | 'AGENT_LISTING' | 'WORKFLOW_TEMPLATE' | 'PLUGIN' | 'INTEGRATION' | 'ENTERPRISE_PLAN'
    assetId?: string
    amountCents?: number
    notes?: string
  }

  try {
    if (body.action === 'approve' && body.procurementId) {
      const approved = await approveProcurementRequest({
        procurementId: body.procurementId,
        approvedById: identity.userId,
        approverWorkspaceRole: identity.workspaceRole,
      })
      return NextResponse.json({ request: approved })
    }

    const created = await createProcurementRequest({
      workspaceId,
      requestedById: identity.userId,
      assetType: body.assetType ?? 'PLUGIN',
      assetId: body.assetId ?? 'unknown-asset',
      amountCents: body.amountCents ?? 0,
      notes: body.notes,
    })

    return NextResponse.json({ request: created })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Procurement request failed' }, { status: 400 })
  }
}
