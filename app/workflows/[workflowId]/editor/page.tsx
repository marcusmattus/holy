import { VisualWorkflowEditor } from '@/features/workflows/visual/VisualWorkflowEditor'

export default async function WorkflowEditorPage({
  params,
}: {
  params: Promise<{ workflowId: string }>
}) {
  const { workflowId } = await params

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-8 text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold">Workflow Editor · {workflowId}</h1>
        <p className="mt-2 text-sm text-[#A1A1AA]">
          Build visual workflows with explicit safety nodes and approval gates.
        </p>
        <div className="mt-6">
          <VisualWorkflowEditor />
        </div>
      </div>
    </main>
  )
}
