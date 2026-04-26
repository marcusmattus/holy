import { NextResponse } from 'next/server'
import { TemplateStatus } from '@prisma/client'
import { createTemplateFromProject, updateTemplateStatus } from '@/server/services/template.service'

export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const body = await req.json()

  if (!body.creatorId || typeof body.creatorId !== 'string') {
    return NextResponse.json({ error: 'creatorId is required' }, { status: 400 })
  }

  if (!body.title || typeof body.title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  if (!body.description || typeof body.description !== 'string') {
    return NextResponse.json({ error: 'description is required' }, { status: 400 })
  }

  try {
    const template = await createTemplateFromProject({
      projectId,
      creatorId: body.creatorId,
      title: body.title,
      description: body.description,
      category: body.category,
      priceType: body.priceType,
      priceCents: body.priceCents,
    })

    return NextResponse.json({ template })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  await params
  const body = await req.json()

  if (!body.templateId || typeof body.templateId !== 'string' || !body.creatorId || typeof body.creatorId !== 'string') {
    return NextResponse.json({ error: 'templateId and creatorId are required' }, { status: 400 })
  }

  const nextStatus = body.status as TemplateStatus
  if (!nextStatus || !Object.values(TemplateStatus).includes(nextStatus)) {
    return NextResponse.json({ error: 'valid status is required' }, { status: 400 })
  }

  const template = await updateTemplateStatus(body.templateId, body.creatorId, nextStatus)
  return NextResponse.json({ template })
}
