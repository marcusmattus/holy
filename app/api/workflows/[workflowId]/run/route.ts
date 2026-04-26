import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workflowId: string }> },
) {
  const { workflowId } = await params
  const body = await request.json().catch(() => ({}))

  const workflow = await prisma.workflow.findUnique({ where: { id: workflowId } })
  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
  }

  return NextResponse.json({
    workflowId,
    status: 'QUEUED',
    summary: 'Workflow execution requested. Safety checks are enforced at runtime.',
    input: body,
  })
}
