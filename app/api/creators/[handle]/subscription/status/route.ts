import { getRequestContext } from '@/server/auth/request-context'
import { getCreatorSubscriptionStatus } from '@/server/services/creator-subscription.service'

type RouteParams = {
  params: Promise<{ handle: string }>
}

export async function GET(req: Request, { params }: RouteParams) {
  const { handle } = await params
  const { userId } = getRequestContext(req)
  const status = await getCreatorSubscriptionStatus(handle, userId)
  return Response.json(status)
}
