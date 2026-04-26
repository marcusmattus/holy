'use client'

import type { VisualWorkflowDefinition } from '@/features/workflows/visual/types'

export function WorkflowInspector({ definition }: { definition: VisualWorkflowDefinition }) {
  return (
    <aside className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F]/80 p-4 backdrop-blur">
      <h3 className="text-sm font-semibold text-[#F8FAFC]">Workflow Inspector</h3>
      <p className="mt-1 text-xs text-[#A1A1AA]">Version {definition.version}</p>
      <dl className="mt-3 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <dt className="text-[#A1A1AA]">Nodes</dt>
          <dd className="text-[#F8FAFC]">{definition.nodes.length}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#A1A1AA]">Edges</dt>
          <dd className="text-[#F8FAFC]">{definition.edges.length}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#A1A1AA]">Require prod approval</dt>
          <dd className="text-[#F8FAFC]">{String(definition.settings.requireApprovalForProduction)}</dd>
        </div>
      </dl>
    </aside>
  )
}
