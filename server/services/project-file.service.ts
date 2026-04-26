import { prisma } from '@/server/db/client'

export async function getProjectFileMap(projectId: string) {
  const files = await prisma.projectFile.findMany({ where: { projectId } })
  return files.reduce<Record<string, string>>((acc, file) => {
    acc[file.path] = file.content
    return acc
  }, {})
}

export async function upsertProjectFiles(
  projectId: string,
  files: Record<string, string>,
) {
  const entries = Object.entries(files)

  await prisma.$transaction(
    entries.map(([path, content]) =>
      prisma.projectFile.upsert({
        where: { projectId_path: { projectId, path } },
        update: { content },
        create: { projectId, path, content },
      }),
    ),
  )
}
