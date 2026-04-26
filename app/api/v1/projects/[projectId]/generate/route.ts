import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/server/security/api-key-auth'
import { prisma } from '@/server/db'
import { writeAuditLog } from '@/server/security/audit-log'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const auth = await authenticateApiKey(req, ['projects:generate'])
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { projectId } = await params
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: auth.userId },
  })
  if (!project) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const body = (await req.json()) as { prompt?: string }
  const prompt = body.prompt ?? 'Generate starter app scaffolding.'
  const generatedFiles = {
    '/App.tsx': `export default function App() { return <div>${prompt}</div> }`,
  }

  const version = await prisma.projectVersion.create({
    data: {
      projectId,
      label: 'api-generated',
      code: JSON.stringify(generatedFiles),
    },
  })

  await writeAuditLog({
    actorId: auth.userId,
    action: 'api.projects.generate',
    targetType: 'ProjectVersion',
    targetId: version.id,
    workspaceId: auth.workspaceId,
  })

  return NextResponse.json({ version, files: generatedFiles })
}
