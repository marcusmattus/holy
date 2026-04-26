import { createWorkspaceBillingPortal } from '@/server/services/workspace-billing.service'

type RouteParams = {
  params: Promise<{ workspaceId: string }>
}

export async function GET(req: Request, { params }: RouteParams) {
  const { workspaceId } = await params
  const requestUrl = new URL(req.url)
  const customerId = requestUrl.searchParams.get('customerId')
  if (!customerId) {
    return Response.json({ error: 'customerId query parameter is required' }, { status: 400 })
  }
  try {
    const portal = await createWorkspaceBillingPortal(workspaceId, customerId)
    return Response.json(portal)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create billing portal session'
    return Response.json({ error: message }, { status: 400 })
  }
}
