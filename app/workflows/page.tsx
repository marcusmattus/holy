import { WorkflowBuilder } from '@/features/workflows/components/WorkflowBuilder'
import { WorkflowRunTimeline } from '@/features/workflows/components/WorkflowRunTimeline'

export const metadata = { title: 'Autonomous Workflows — Holy' }

export default function WorkflowsPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-xl border border-[#C9A24A]/30 bg-[#0A0A0A]/80 p-6">
        <h1 className="text-3xl font-semibold">Autonomous workflows</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Chain agents and actions with approval gates for production safety.
        </p>
      </section>
      <WorkflowBuilder />
      <WorkflowRunTimeline />
    </main>
  )
}
