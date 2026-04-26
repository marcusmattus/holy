import { NextResponse } from 'next/server'
import { publishProject } from '@/server/services/store.service'

export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const body = await req.json()

  const listing = await publishProject({
    projectId,
    title: body.title,
    description: body.description,
    category: body.category,
    priceType: body.priceType,
    priceCents: body.priceCents,
  })

  return NextResponse.json({ listing })
}
