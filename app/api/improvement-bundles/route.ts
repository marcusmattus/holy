import { NextResponse } from 'next/server'
import {
  createImprovementBundle,
  listImprovementBundles,
} from '@/server/services/improvement-bundle.service'

export async function GET() {
  const bundles = await listImprovementBundles()
  return NextResponse.json({ bundles })
}

export async function POST(req: Request) {
  const body = await req.json()
  const bundle = await createImprovementBundle({
    workspaceId: body.workspaceId,
    projectId: body.projectId,
    listingId: body.listingId,
    title: body.title,
    summary: body.summary,
    actions: body.actions ?? [],
    riskLevel: body.riskLevel,
  })

  return NextResponse.json({ bundle }, { status: 201 })
}
