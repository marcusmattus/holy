import { getRequestContext } from '@/server/auth/request-context'
import { createTemplateCheckoutSession } from '@/server/services/template-payment.service'

type RouteParams = {
  params: Promise<{ templateId: string }>
}

export async function POST(req: Request, { params }: RouteParams) {
  const { templateId } = await params
  const { userId } = getRequestContext(req)

  try {
    const session = await createTemplateCheckoutSession(templateId, userId)
    return Response.json(session)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Template checkout failed'
    return Response.json({ error: message }, { status: 400 })
  }
}
