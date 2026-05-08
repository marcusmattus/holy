import Link from 'next/link'
import { prisma } from '@/lib/db'
import {
  Code2,
  BarChart2,
  Store,
  Globe,
  Clock,
  Star,
  Download,
} from 'lucide-react'

async function getProject(id: string) {
  try {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        versions: { orderBy: { createdAt: 'desc' }, take: 5 },
        storeEntry: true,
        _count: { select: { versions: true } },
      },
    })
  } catch {
    return null
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string }
}) {
  const { projectId } = params
  const project = await getProject(projectId)

  // Fallback for static/demo IDs
  const name = project?.name ?? `Project ${projectId}`
  const description = project?.description ?? null
  const category = project?.category ?? null
  const storeEntry = project?.storeEntry ?? null
  const versions = project?.versions ?? []

  const storeStatusColor: Record<string, string> = {
    DRAFT: 'text-muted-foreground bg-muted/50',
    IN_REVIEW: 'text-yellow-500 bg-yellow-500/10',
    PUBLISHED: 'text-[#10B981] bg-[#10B981]/10',
    REJECTED: 'text-destructive bg-destructive/10',
  }

  return (
    <div className="space-y-6 relative">
      <div className="ethereal-bg" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/projects" className="hover:text-foreground transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{name}</h1>
          {description && (
            <p className="text-sm text-muted-foreground max-w-lg">{description}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
                {category}
              </span>
            )}
            {storeEntry && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${storeStatusColor[storeEntry.status] ?? 'text-muted-foreground'}`}>
                Store: {storeEntry.status.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/projects/${projectId}/analytics`}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <BarChart2 size={14} />
            Analytics
          </Link>
          {!storeEntry || storeEntry.status === 'DRAFT' ? (
            <Link
              href={`/dashboard/projects/${projectId}/publish`}
              className="flex items-center gap-1.5 rounded-lg border border-[#C9A24A] text-[#C9A24A] px-3 py-2 text-sm font-medium hover:bg-[#C9A24A]/10 transition-colors"
            >
              <Store size={14} />
              Publish to Store
            </Link>
          ) : null}
          <Link
            href={`/dashboard/projects/${projectId}/editor`}
            className="flex items-center gap-1.5 rounded-lg bg-[#7C3AED] px-3 py-2 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors"
          >
            <Code2 size={14} />
            Open Editor
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Versions', value: project?._count?.versions ?? '—', icon: Clock },
          { label: 'Installs', value: storeEntry?.installs ?? '—', icon: Download },
          { label: 'Rating', value: storeEntry ? storeEntry.avgRating.toFixed(1) : '—', icon: Star },
          { label: 'Reviews', value: storeEntry?.reviewCount ?? '—', icon: Globe },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon size={13} />
              <p className="text-xs">{label}</p>
            </div>
            <p className="text-2xl font-bold">{String(value)}</p>
          </div>
        ))}
      </div>

      {/* Store Entry Info */}
      {storeEntry && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Store size={15} className="text-[#C9A24A]" />
            Store Listing
          </h2>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${storeStatusColor[storeEntry.status] ?? ''}`}>
              {storeEntry.status.replace('_', ' ')}
            </span>
            {storeEntry.submittedAt && (
              <span className="text-xs text-muted-foreground">
                Submitted {new Date(storeEntry.submittedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          {storeEntry.demoUrl && (
            <a
              href={storeEntry.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#7C3AED] hover:underline"
            >
              <Globe size={13} />
              View Demo
            </a>
          )}
        </div>
      )}

      {/* Version History */}
      {versions.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-sm">Version History</h2>
          </div>
          <div className="divide-y divide-border">
            {versions.map((v: typeof versions[number], i: number) => (
              <div key={v.id} className="flex items-center px-4 py-3 gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-xs font-bold text-[#7C3AED]">
                  v{versions.length - i}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{v.label ?? 'Snapshot'}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(v.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for new project */}
      {!project && (
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
          <Code2 size={32} className="mx-auto text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Open the editor to start building with Holy AI
          </p>
          <Link
            href={`/dashboard/projects/${projectId}/editor`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors"
          >
            <Code2 size={14} />
            Open Editor
          </Link>
        </div>
      )}
    </div>
  )
}
