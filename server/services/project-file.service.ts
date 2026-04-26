import { prisma } from '@/server/db/client'

export type FileMap = Record<string, string>

export async function getProjectFileMap(projectId: string): Promise<FileMap> {
  const files = await prisma.projectFile.findMany({ where: { projectId } })
  return Object.fromEntries(files.map((file) => [file.path, file.content]))
}

export async function upsertProjectFiles(projectId: string, files: FileMap) {
  return prisma.$transaction(
    Object.entries(files).map(([path, content]) =>
      prisma.projectFile.upsert({
        where: { projectId_path: { projectId, path } },
        update: { content },
        create: { projectId, path, content },
      })
    )
  )
}
