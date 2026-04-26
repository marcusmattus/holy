import Link from 'next/link'

export default async function WorkflowTemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-8 text-[#F8FAFC]">
      <div className="mx-auto max-w-3xl rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-6">
        <p className="text-xs uppercase tracking-wide text-[#C9A24A]">Template</p>
        <h1 className="mt-2 text-2xl font-semibold">{slug}</h1>
        <p className="mt-2 text-sm text-[#A1A1AA]">
          Install this template to bootstrap an approval-safe orchestration workflow.
        </p>
        <Link href="/workflow-templates" className="mt-6 inline-block text-sm text-[#C9A24A]">
          ← Back to templates
        </Link>
      </div>
    </main>
  )
}
