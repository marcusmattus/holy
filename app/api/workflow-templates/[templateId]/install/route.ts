import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/server/db'
import { getRequestUserId, getRequestWorkspaceId } from '@/server/services/request-context'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ templateId: string }> },
) {
  const { templateId } = await params
  const userId = getRequestUserId(_request)
  const workspaceId = getRequestWorkspaceId(_request)

  const template = await prisma.workflowTemplate.findUnique({
    where: { id: templateId },
  })

  if (!template || template.status !== 'PUBLISHED') {
    return NextResponse.json({ error: 'Template is not available' }, { status: 404 })
  }

  const workflow = await prisma.workflow.create({
    data: {
      ownerId: userId,
      workspaceId: workspaceId ?? undefined,
      name: `${template.title} (Installed)`,
      definition: (template.definition ?? {}) as Prisma.InputJsonValue,
    },
  })

  const install = await prisma.workflowTemplateInstall.create({
    data: {
      templateId,
      workspaceId: workspaceId ?? undefined,
      userId,
      workflowId: workflow.id,
    },
  })

  return NextResponse.json({ workflow, install }, { status: 201 })
}
