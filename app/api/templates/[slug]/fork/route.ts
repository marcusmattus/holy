import { NextResponse } from 'next/server'
import { forkTemplateBySlug } from '@/server/services/template.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const body = await req.json()

  if (!body.userId || typeof body.userId !== 'string') {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const project = await forkTemplateBySlug({
    slug,
    userId: body.userId,
    projectName: body.projectName,
  })

  return NextResponse.json({ project })
}
