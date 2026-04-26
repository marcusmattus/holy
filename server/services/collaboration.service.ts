import { CommentStatus, Prisma, SessionStatus } from '@prisma/client'
import { prisma } from '@/server/db/client'
import { broadcastProjectPresence } from '@/server/realtime/presence.service'

const ACTIVE_SESSION_WINDOW_MS = 1000 * 60 * 5
const DEFAULT_LOCK_DURATION_MS = 1000 * 60 * 10

export async function assertProjectAccess(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, userId: true, workspaceId: true },
  })

  if (!project) {
    throw new Error('Project not found')
  }

  if (project.userId === userId) {
    return true
  }

  if (!project.workspaceId) {
    throw new Error('Forbidden')
  }

  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: project.workspaceId,
        userId,
      },
    },
    select: { id: true },
  })

  if (!membership) {
    throw new Error('Forbidden')
  }

  return true
}

export async function ensureTemplatePublishPermission(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true, workspaceId: true },
  })

  if (!project) {
    throw new Error('Project not found')
  }

  if (project.userId === userId) {
    return
  }

  if (!project.workspaceId) {
    throw new Error('Forbidden')
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: project.workspaceId,
        userId,
      },
    },
    select: { role: true },
  })

  if (!member || (member.role !== 'ADMIN' && member.role !== 'OWNER')) {
    throw new Error('Forbidden')
  }
}

export async function upsertStudioPresence(input: {
  projectId: string
  userId: string
  metadata?: Record<string, unknown>
}) {
  await assertProjectAccess(input.projectId, input.userId)

  const session = await prisma.studioSession.upsert({
    where: {
      projectId_userId: {
        projectId: input.projectId,
        userId: input.userId,
      },
    },
    update: {
      status: SessionStatus.ACTIVE,
      lastSeenAt: new Date(),
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
    create: {
      projectId: input.projectId,
      userId: input.userId,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  })

  await broadcastProjectPresence(input.projectId)

  return session
}

export async function listActiveStudioSessions(projectId: string, userId: string) {
  await assertProjectAccess(projectId, userId)

  const cutoff = new Date(Date.now() - ACTIVE_SESSION_WINDOW_MS)
  return prisma.studioSession.findMany({
    where: {
      projectId,
      lastSeenAt: { gte: cutoff },
      status: { in: [SessionStatus.ACTIVE, SessionStatus.IDLE] },
    },
    include: { user: true },
    orderBy: { lastSeenAt: 'desc' },
  })
}

export async function createStudioComment(input: {
  projectId: string
  userId: string
  body: string
  filePath?: string
  componentId?: string
  versionId?: string
}) {
  await assertProjectAccess(input.projectId, input.userId)

  return prisma.studioComment.create({
    data: {
      projectId: input.projectId,
      userId: input.userId,
      body: input.body,
      filePath: input.filePath,
      componentId: input.componentId,
      versionId: input.versionId,
    },
    include: { user: true },
  })
}

export async function listStudioComments(projectId: string, userId: string) {
  await assertProjectAccess(projectId, userId)

  return prisma.studioComment.findMany({
    where: { projectId },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function resolveStudioComment(commentId: string, userId: string) {
  const comment = await prisma.studioComment.findUnique({
    where: { id: commentId },
    select: { id: true, projectId: true },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  await assertProjectAccess(comment.projectId, userId)

  return prisma.studioComment.update({
    where: { id: commentId },
    data: { status: CommentStatus.RESOLVED },
  })
}

export async function acquireFileLock(input: {
  projectId: string
  userId: string
  filePath: string
  ttlMs?: number
}) {
  await assertProjectAccess(input.projectId, input.userId)

  const now = new Date()
  await prisma.fileLock.deleteMany({
    where: {
      projectId: input.projectId,
      expiresAt: { lte: now },
    },
  })

  const expiresAt = new Date(now.getTime() + (input.ttlMs ?? DEFAULT_LOCK_DURATION_MS))

  try {
    return await prisma.fileLock.create({
      data: {
        projectId: input.projectId,
        userId: input.userId,
        filePath: input.filePath,
        expiresAt,
      },
      include: { user: true },
    })
  } catch {
    return prisma.fileLock.findUnique({
      where: {
        projectId_filePath: {
          projectId: input.projectId,
          filePath: input.filePath,
        },
      },
      include: { user: true },
    })
  }
}

export async function releaseFileLock(input: {
  projectId: string
  userId: string
  filePath: string
}) {
  await assertProjectAccess(input.projectId, input.userId)

  return prisma.fileLock.deleteMany({
    where: {
      projectId: input.projectId,
      filePath: input.filePath,
      userId: input.userId,
    },
  })
}

export async function listActiveFileLocks(projectId: string, userId: string) {
  await assertProjectAccess(projectId, userId)

  const now = new Date()
  await prisma.fileLock.deleteMany({
    where: {
      projectId,
      expiresAt: { lte: now },
    },
  })

  return prisma.fileLock.findMany({
    where: {
      projectId,
      expiresAt: { gt: now },
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })
}
