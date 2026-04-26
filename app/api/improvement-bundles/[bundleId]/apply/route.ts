import { NextResponse } from 'next/server'
import { applyImprovementBundle } from '@/server/services/improvement-bundle.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bundleId: string }> },
) {
  const body = await req.json().catch(() => ({}))
  const { bundleId } = await params
  const bundle = await applyImprovementBundle(bundleId, body.actorId ?? 'admin-user')
  return NextResponse.json({ bundle })
}
