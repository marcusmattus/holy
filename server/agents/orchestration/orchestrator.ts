import type { SuggestionImpact } from '@prisma/client'
import { AgentMemory } from '@/server/agents/orchestration/agent-memory'
import { AgentMessageBus } from '@/server/agents/orchestration/agent-message-bus'
import { routeAgentRequest } from '@/server/agents/orchestration/agent-router'
import type { OrchestrationGraph } from '@/server/agents/orchestration/types'

export class Orchestrator {
  private readonly memory = new AgentMemory()
  private readonly bus = new AgentMessageBus()

  async run(input: {
    runId: string
    graph: OrchestrationGraph
    workspaceId?: string | null
    payload?: Record<string, unknown>
  }) {
    const outputs: Array<Record<string, unknown>> = []
    let highestRisk: SuggestionImpact = 'LOW'

    for (const node of input.graph.nodes) {
      const routed = routeAgentRequest({
        agentId: node.agentId,
        allowedActions: node.allowedActions,
        requestedAction: (input.payload?.requestedAction as string) ?? 'READ_ANALYTICS',
        payload: input.payload ?? {},
      })

      if (routed.policy.riskLevel === 'CRITICAL') highestRisk = 'CRITICAL'
      else if (routed.policy.riskLevel === 'HIGH' && highestRisk !== 'CRITICAL') highestRisk = 'HIGH'
      else if (
        routed.policy.riskLevel === 'MEDIUM' &&
        highestRisk !== 'CRITICAL' &&
        highestRisk !== 'HIGH'
      ) {
        highestRisk = 'MEDIUM'
      }

      this.memory.set(input.workspaceId, `agent:${node.agentId}:last`, routed.output)

      await this.bus.publish(input.runId, {
        fromAgentId: node.agentId,
        role: 'AGENT',
        content: {
          action: routed.action,
          policy: routed.policy,
          output: routed.output,
        },
      })

      outputs.push({
        agentId: node.agentId,
        allowedActions: node.allowedActions,
        result: routed.output,
        policy: routed.policy,
      })
    }

    return {
      summary: 'Orchestration run completed with structured JSON outputs',
      riskLevel: highestRisk,
      proposedActions: outputs
        .map((entry) => entry.policy as { requiresApproval?: boolean; reason?: string })
        .filter((policy) => policy.requiresApproval)
        .map((policy) => ({ type: 'APPROVAL_REQUIRED', reason: policy.reason })),
      outputs,
    }
  }
}
