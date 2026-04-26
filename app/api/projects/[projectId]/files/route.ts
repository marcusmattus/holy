import { NextResponse } from 'next/server'
import { getProjectFileMap, upsertProjectFiles } from '@/server/services/project-file.service'

export async function GET(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const files = await getProjectFileMap(projectId)
  return NextResponse.json({ files })
}

export async function PUT(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { files } = await req.json()
  await upsertProjectFiles(projectId, files)
  return NextResponse.json({ ok: true })
}
