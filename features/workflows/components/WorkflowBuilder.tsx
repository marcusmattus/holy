import { WorkflowNode } from '@/features/workflows/components/WorkflowNode'

const DEFAULT_NODES = [
  { label: 'Run QA', requiresApproval: false },
  { label: 'Apply patch', requiresApproval: true },
  { label: 'Deploy production', requiresApproval: true },
]

export function WorkflowBuilder() {
  return (
    <section className="rounded-xl border border-[#C9A24A]/25 bg-[#0A0A0A]/75 p-4">
      <h2 className="text-lg font-semibold">Workflow builder</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {DEFAULT_NODES.map((node) => (
          <WorkflowNode
            key={node.label}
            label={node.label}
            requiresApproval={node.requiresApproval}
          />
        ))}
      </div>
    </section>
  )
}
