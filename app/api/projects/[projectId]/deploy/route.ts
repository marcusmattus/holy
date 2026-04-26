import { NextResponse } from 'next/server'
import { deployProject } from '@/server/services/deployment.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params
  const body = await req.json().catch(() => ({}))

  const deployment = await deployProject({
    projectId,
    target: body.target ?? 'preview',
  })

  return NextResponse.json({ deployment })
}
