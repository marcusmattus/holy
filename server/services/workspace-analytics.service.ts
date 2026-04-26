import { prisma } from '@/server/services/prisma'

function getUtcDateFloor(value = new Date()) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()))
}

export async function rebuildWorkspaceAnalyticsDaily(date = getUtcDateFloor()) {
  const workspaces = await prisma.workspace.findMany({
    select: { id: true },
  })

  const writes = workspaces.map((workspace) =>
    prisma.workspaceAnalyticsDaily.upsert({
      where: { workspaceId_date: { workspaceId: workspace.id, date } },
      update: {},
      create: {
        workspaceId: workspace.id,
        date,
      },
    }),
  )
  await Promise.all(writes)
  return { date, processed: workspaces.length }
}

export async function getWorkspaceAnalytics(workspaceId: string) {
  return prisma.workspaceAnalyticsDaily.findMany({
    where: { workspaceId },
    orderBy: { date: 'desc' },
    take: 30,
  })
}
