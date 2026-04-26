import { getRequestContext } from '@/server/auth/request-context'
import { hasTemplateAccess } from '@/server/services/template-payment.service'

type RouteParams = {
  params: Promise<{ templateId: string }>
}

export async function GET(req: Request, { params }: RouteParams) {
  const { templateId } = await params
  const { userId } = getRequestContext(req)
  const hasAccess = await hasTemplateAccess(templateId, userId)

  return Response.json({ hasAccess })
}
