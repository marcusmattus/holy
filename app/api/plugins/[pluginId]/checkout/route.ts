import { NextResponse } from 'next/server'
import { checkoutPlugin } from '@/server/services/plugin-payment.service'
import { getRequestIdentity } from '@/server/security'

export async function POST(
  request: Request,
  context: { params: Promise<{ pluginId: string }> },
) {
  const { pluginId } = await context.params
  const identity = getRequestIdentity(request)
  const body = (await request.json()) as { projectId?: string }

  try {
    const purchase = await checkoutPlugin({
      pluginId,
      buyerId: identity.userId,
      projectId: body.projectId,
    })

    return NextResponse.json({ purchase })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Checkout failed' }, { status: 400 })
  }
}
