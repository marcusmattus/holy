import { NextResponse } from 'next/server'
import { getTemplateBySlug } from '@/server/services/template.service'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = await getTemplateBySlug(slug)

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  return NextResponse.json({ template })
}
