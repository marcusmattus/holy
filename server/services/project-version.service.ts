import { prisma } from '@/server/db/client'
import type { FileMap } from './project-file.service'

export async function createProjectVersion(input: {
  projectId: string
  files: FileMap
  prompt?: string
  summary?: string
  label?: string
}) {
  return prisma.projectVersion.create({
    data: {
      projectId: input.projectId,
      filesJson: input.files,
      code: JSON.stringify(input.files),
      prompt: input.prompt,
      summary: input.summary,
      label: input.label,
    },
  })
}

export async function listProjectVersions(projectId: string) {
  return prisma.projectVersion.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function restoreProjectVersion(versionId: string) {
  const version = await prisma.projectVersion.findUniqueOrThrow({ where: { id: versionId } })
  return version.filesJson as FileMap
}
