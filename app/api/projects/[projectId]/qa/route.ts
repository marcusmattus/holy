import { NextResponse } from 'next/server'
import { assertProjectAccess } from '@/server/services/collaboration.service'
import { runProjectQa } from '@/server/services/app-qa.service'

export async function GET(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const userId = new URL(req.url).searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    await assertProjectAccess(projectId, userId)
    const result = await runProjectQa(projectId)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}
