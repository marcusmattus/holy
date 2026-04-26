import { AgentRunStatus } from '@prisma/client'
import { prisma } from '@/server/db'
import { runAgent } from '@/server/agents/core/agent-runner'

const DEFAULT_SCHEDULE_INTERVAL_MS = 60 * 60 * 1000
const MAX_SCHEDULES_PER_BATCH = 20

export async function runDueAgentSchedules() {
  const now = new Date()
  const schedules = await prisma.agentSchedule.findMany({
    where: {
      enabled: true,
      OR: [{ nextRunAt: null }, { nextRunAt: { lte: now } }],
    },
    include: { agent: true },
    take: MAX_SCHEDULES_PER_BATCH,
  })

  for (const schedule of schedules) {
    const activeRun = await prisma.agentRun.findFirst({
      where: {
        agentId: schedule.agentId,
        status: AgentRunStatus.RUNNING,
      },
    })
    if (activeRun) continue

    await runAgent({
      agentId: schedule.agentId,
      type: schedule.agent.type,
      userId: schedule.agent.ownerId,
      workspaceId: schedule.agent.workspaceId ?? undefined,
    })

    await prisma.agentSchedule.update({
      where: { id: schedule.id },
      data: {
        lastRunAt: now,
        nextRunAt: new Date(now.getTime() + DEFAULT_SCHEDULE_INTERVAL_MS),
      },
    })
  }
}
