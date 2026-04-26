import { AlertSeverity, AlertType } from '@prisma/client'
import { getRequestContext } from '@/server/auth/request-context'
import { createSystemAlert, listSystemAlerts } from '@/server/services/monitoring.service'

export async function GET(req: Request) {
  const { isAdmin } = getRequestContext(req)
  if (!isAdmin) {
    return Response.json({ error: 'Admin access required' }, { status: 403 })
  }

  const alerts = await listSystemAlerts()
  return Response.json({ alerts })
}

export async function POST(req: Request) {
  const { isAdmin } = getRequestContext(req)
  if (!isAdmin) {
    return Response.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await req.json()
  const alert = await createSystemAlert({
    type: (body.type as AlertType) ?? AlertType.AI_PROVIDER_FAILURE,
    severity: (body.severity as AlertSeverity) ?? AlertSeverity.MEDIUM,
    title: typeof body.title === 'string' ? body.title : 'System alert',
    message: typeof body.message === 'string' ? body.message : 'No message provided',
    metadata: typeof body.metadata === 'object' ? body.metadata : undefined,
  })

  return Response.json({ alert })
}
