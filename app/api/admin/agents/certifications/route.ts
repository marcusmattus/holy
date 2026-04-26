import { NextResponse } from 'next/server'
import { listAgentCertifications, reviewAgentCertification } from '@/server/services/agent-certification.service'
import { requireAdmin } from '@/server/services/access-control.service'

export async function GET(req: Request) {
  try {
    requireAdmin(req.headers, 'agent.certification.list')
    return NextResponse.json(await listAgentCertifications())
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
}

export async function POST(req: Request) {
  try {
    const actor = requireAdmin(req.headers, 'agent.certification.review')
    const body = await req.json()
    return NextResponse.json(
      await reviewAgentCertification({
        certificationId: body.certificationId,
        reviewerId: actor,
        approve: Boolean(body.approve),
      })
    )
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
}
