import { NextResponse } from 'next/server'
import { listPublishedTemplates } from '@/server/services/template.service'

export async function GET() {
  const templates = await listPublishedTemplates()
  return NextResponse.json({ templates })
}
