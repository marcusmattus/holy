import { prisma } from '@/server/db'
import { Prisma } from '@prisma/client'
import type { AgentRunMessage } from '@/server/agents/orchestration/types'

export class AgentMessageBus {
  async publish(runId: string, message: AgentRunMessage) {
    return prisma.agentMessage.create({
      data: {
        runId,
        fromAgentId: message.fromAgentId,
        toAgentId: message.toAgentId,
        role: message.role,
        content: message.content as Prisma.InputJsonValue,
      },
    })
  }
}
