import { NextResponse } from 'next/server'
import { restoreProjectVersion } from '@/server/services/project-version.service'
import { upsertProjectFiles } from '@/server/services/project-file.service'

export async function POST(
  _: Request,
  { params }: { params: Promise<{ projectId: string; versionId: string }> }
) {
  const { projectId, versionId } = await params
  const files = await restoreProjectVersion(versionId)
  await upsertProjectFiles(projectId, files)
  return NextResponse.json({ files })
}
