import Link from 'next/link'
import CreateTemplateModal from '@/features/templates/components/CreateTemplateModal'

export default function ProjectPage({
  params,
}: {
  params: { projectId: string }
}) {
  const { projectId } = params
  const projectNames: Record<string, string> = {
    '1': 'Holy Commerce',
    '2': 'Neon Dashboard',
    '3': 'Launch Page v2',
    '4': 'Analytics Suite',
  }
  const name = projectNames[projectId] ?? `Project ${projectId}`

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/projects" className="hover:text-foreground">
          Projects
        </Link>
        <span>/</span>
        <span className="text-foreground">{name}</span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="flex gap-2">
          <CreateTemplateModal projectId={projectId} />
          <Link
            href={`/dashboard/projects/${projectId}/analytics`}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Analytics
          </Link>
          <Link
            href={`/dashboard/projects/${projectId}/editor`}
            className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors"
          >
            Open Editor
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Views', value: '12,400' },
          { label: 'Unique Visitors', value: '4,820' },
          { label: 'Revenue', value: '$840' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-3">Deployment</h2>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-sm">
            Live at{' '}
            <a href="#" className="text-[#7C3AED] hover:underline">
              holy-commerce.holy.app
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}
