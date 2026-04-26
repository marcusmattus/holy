import { createWorkspaceBillingPortal } from '@/server/services/workspace-billing.service'

type RouteParams = {
  params: Promise<{ workspaceId: string }>
}

export async function GET(_: Request, { params }: RouteParams) {
  const { workspaceId } = await params
  const portal = createWorkspaceBillingPortal(workspaceId)
  return Response.json(portal)
}
