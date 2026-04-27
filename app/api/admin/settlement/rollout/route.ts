import { emergencyDisableSettlement, getSettlementRolloutPolicy } from '@/server/services/settlement-rollout.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const workspaceId = searchParams.get('workspaceId')
  if (!workspaceId) {
    return Response.json({ error: 'workspaceId is required' }, { status: 400 })
  }
  return Response.json({ policy: getSettlementRolloutPolicy(workspaceId) })
}

export async function POST(req: Request) {
  const body = await req.json()
  const workspaceId = typeof body.workspaceId === 'string' ? body.workspaceId : ''
  if (!workspaceId) {
    return Response.json({ error: 'workspaceId is required' }, { status: 400 })
  }

  const policy = emergencyDisableSettlement(workspaceId)
  return Response.json({ policy })
}
