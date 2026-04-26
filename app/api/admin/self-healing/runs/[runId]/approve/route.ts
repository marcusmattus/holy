import { NextResponse } from 'next/server'
import { approveRun } from '@/server/services/self-healing.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  const body = await req.json().catch(() => ({}))
  const { runId } = await params
  const run = await approveRun(runId, body.approverId ?? 'admin-user')
  return NextResponse.json({ run })
}
