import Link from 'next/link'

const TEMPLATES = [
  {
    slug: 'agent-pricing-review',
    title: 'Agent Pricing Review',
    description: 'Run analytics + approval gates before listing updates.',
    category: 'Monetization',
  },
  {
    slug: 'qa-to-preview',
    title: 'QA to Preview Deploy',
    description: 'Automated QA, then preview deploy with production lock.',
    category: 'Release',
  },
]

export function WorkflowTemplateMarketplace() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {TEMPLATES.map((template) => (
        <article key={template.slug} className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4">
          <p className="text-xs uppercase tracking-wide text-[#C9A24A]">{template.category}</p>
          <h3 className="mt-2 text-lg font-semibold text-[#F8FAFC]">{template.title}</h3>
          <p className="mt-1 text-sm text-[#A1A1AA]">{template.description}</p>
          <Link href={`/workflow-templates/${template.slug}`} className="mt-4 inline-block text-sm text-[#C9A24A]">
            View template →
          </Link>
        </article>
      ))}
    </div>
  )
}
