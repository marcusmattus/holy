import { WorkflowTemplateMarketplace } from '@/features/workflows/components/WorkflowTemplateMarketplace'

export default function WorkflowTemplatesPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-8 text-[#F8FAFC]">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold">Workflow Templates</h1>
        <p className="mt-2 text-sm text-[#A1A1AA]">
          Publish and install reusable visual workflows with compliance-aware monetization.
        </p>
        <div className="mt-6">
          <WorkflowTemplateMarketplace />
        </div>
      </div>
    </main>
  )
}
