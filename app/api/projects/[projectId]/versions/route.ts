import { NextResponse } from 'next/server'
import { createProjectVersion, listProjectVersions } from '@/server/services/project-version.service'

export async function GET(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const versions = await listProjectVersions(projectId)
  return NextResponse.json({ versions })
}

export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const body = await req.json()
  const version = await createProjectVersion({
    projectId,
    files: body.files,
    prompt: body.prompt,
    summary: body.summary,
    label: body.label,
  })
  return NextResponse.json({ version })
}
