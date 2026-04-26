'use client'

import { useMemo, useState } from 'react'
import { ReactFlow, Background, Controls, type Edge, type Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { AgentNode } from '@/features/workflows/visual/nodes/AgentNode'
import { ApprovalNode } from '@/features/workflows/visual/nodes/ApprovalNode'
import { QaNode } from '@/features/workflows/visual/nodes/QaNode'
import { DeployNode } from '@/features/workflows/visual/nodes/DeployNode'
import { ListingUpdateNode } from '@/features/workflows/visual/nodes/ListingUpdateNode'
import { DEFAULT_WORKFLOW_DEFINITION, type VisualWorkflowDefinition } from '@/features/workflows/visual/types'
import { WorkflowToolbar } from '@/features/workflows/visual/WorkflowToolbar'
import { WorkflowInspector } from '@/features/workflows/visual/WorkflowInspector'

const nodeTypes = {
  RUN_AGENT: AgentNode,
  APPROVAL_GATE: ApprovalNode,
  RUN_QA: QaNode,
  APPLY_PATCH: AgentNode,
  DEPLOY_PREVIEW: DeployNode,
  DEPLOY_PRODUCTION: DeployNode,
  UPDATE_LISTING: ListingUpdateNode,
  SEND_NOTIFICATION: AgentNode,
  WEBHOOK_CALL: AgentNode,
}

function toReactFlow(definition: VisualWorkflowDefinition): { nodes: Node[]; edges: Edge[] } {
  return {
    nodes: definition.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    edges: definition.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
  }
}

export function VisualWorkflowEditor({
  initialDefinition = DEFAULT_WORKFLOW_DEFINITION,
}: {
  initialDefinition?: VisualWorkflowDefinition
}) {
  const [definition] = useState(initialDefinition)
  const { nodes, edges } = useMemo(() => toReactFlow(definition), [definition])

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="space-y-3">
        <WorkflowToolbar />
        <div className="h-[560px] rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
            <Background color="#1f1f1f" gap={20} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
      <WorkflowInspector definition={definition} />
    </section>
  )
}
