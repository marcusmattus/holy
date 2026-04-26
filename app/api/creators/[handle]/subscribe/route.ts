import { getRequestContext } from '@/server/auth/request-context'
import { createCreatorSubscriptionCheckout } from '@/server/services/creator-subscription.service'

type RouteParams = {
  params: Promise<{ handle: string }>
}

export async function POST(req: Request, { params }: RouteParams) {
  const { handle: creatorEmail } = await params
  const { userId } = getRequestContext(req)
  try {
    const session = await createCreatorSubscriptionCheckout(creatorEmail, userId)
    return Response.json(session)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to start subscription checkout'
    return Response.json({ error: message }, { status: 400 })
  }
}
