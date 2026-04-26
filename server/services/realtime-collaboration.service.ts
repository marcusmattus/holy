import { prisma } from '@/server/db/prisma'
import { YjsProvider } from '@/server/realtime/yjs-provider'

const yjsProvider = new YjsProvider()

export async function ensureRealtimeRoom(projectId: string, userId: string) {
  const membership = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  })
  if (!membership) {
    throw new Error('Forbidden: project access required')
  }

  return yjsProvider.createRoom(projectId)
}

export async function getRealtimeRoom(projectId: string, userId: string) {
  const membership = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  })
  if (!membership) {
    throw new Error('Forbidden: project access required')
  }

  return yjsProvider.getRoom(projectId)
}

export async function saveRealtimeSnapshot(
  projectId: string,
  userId: string,
  filePath: string,
  content: string
) {
  const membership = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  })
  if (!membership) {
    throw new Error('Forbidden: project access required')
  }

  return prisma.$transaction(async (tx) => {
    const snapshot = await tx.collaborationSnapshot.create({
      data: {
        projectId,
        filePath,
        content,
        provider: 'yjs',
      },
    })
    await tx.projectVersion.create({
      data: {
        projectId,
        code: content,
      },
    })
    return snapshot
  })
}
