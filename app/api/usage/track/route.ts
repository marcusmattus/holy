import { NextResponse } from 'next/server'
import { UsageEventType } from '@prisma/client'
import { trackUsageEvent } from '@/server/services/usage-meter.service'

export async function POST(req: Request) {
  const body = await req.json()

  if (!body.type || !Object.values(UsageEventType).includes(body.type)) {
    return NextResponse.json({ error: 'valid type is required' }, { status: 400 })
  }

  const event = await trackUsageEvent({
    workspaceId: body.workspaceId,
    userId: body.userId,
    type: body.type,
    quantity: body.quantity,
    metadata: body.metadata,
  })

  return NextResponse.json({ event })
}
