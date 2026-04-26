import { createWorkspaceCheckoutSession, type WorkspacePlan } from '@/server/services/workspace-billing.service'

type RouteParams = {
  params: Promise<{ workspaceId: string }>
}

export async function POST(req: Request, { params }: RouteParams) {
  const { workspaceId } = await params
  const body = await req.json()
  const plan = (body.plan as WorkspacePlan | undefined) ?? 'FREE'

  if (!['FREE', 'PRO', 'TEAM', 'ENTERPRISE'].includes(plan)) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const session = createWorkspaceCheckoutSession(workspaceId, plan)
  return Response.json(session)
}
