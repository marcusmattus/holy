import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { getRequestUserId } from '@/server/services/request-context'

export async function GET() {
  const templates = await prisma.workflowTemplate.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(templates)
}

export async function POST(request: Request) {
  const creatorId = getRequestUserId(request)
  const body = await request.json()

  if (!body?.title || !body?.slug || !body?.description || !body?.definition) {
    return NextResponse.json(
      { error: 'title, slug, description, and definition are required' },
      { status: 400 },
    )
  }

  if (body.priceType && body.priceType !== 'FREE' && body.status !== 'PENDING_REVIEW') {
    return NextResponse.json(
      { error: 'Paid templates must enter compliance review before publishing' },
      { status: 400 },
    )
  }

  const template = await prisma.workflowTemplate.create({
    data: {
      creatorId,
      title: body.title,
      slug: body.slug,
      description: body.description,
      category: body.category,
      definition: body.definition,
      priceType: body.priceType ?? 'FREE',
      priceCents: body.priceCents ?? 0,
      status: body.status ?? 'DRAFT',
    },
  })

  return NextResponse.json(template, { status: 201 })
}
