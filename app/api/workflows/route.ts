import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { getRequestUserId, getRequestWorkspaceId } from '@/server/services/request-context'

export async function POST(request: Request) {
  const ownerId = getRequestUserId(request)
  const workspaceId = getRequestWorkspaceId(request)
  const body = await request.json()

  if (!body?.name || !body?.definition) {
    return NextResponse.json({ error: 'name and definition are required' }, { status: 400 })
  }

  const workflow = await prisma.workflow.create({
    data: {
      ownerId,
      workspaceId: workspaceId ?? undefined,
      name: body.name,
      definition: body.definition,
    },
  })

  return NextResponse.json(workflow, { status: 201 })
}
