import type { Deployment } from '@prisma/client'

const STATUS_CLASS: Record<string, string> = {
  QUEUED: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  BUILDING: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  READY: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  FAILED: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
}

export function DeploymentStatusCard({ deployment }: { deployment: Deployment | null }) {
  if (!deployment) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
        <p className="text-sm text-muted-foreground">No deployments yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Latest deployment</p>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[deployment.status] ?? ''}`}
        >
          {deployment.status}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">URL</p>
        {deployment.url ? (
          <a
            href={deployment.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#D4AF37] hover:underline break-all"
          >
            {deployment.url}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">Pending URL</p>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Build logs</p>
        <div className="rounded-lg border border-border/70 bg-background/50 p-3 text-xs text-muted-foreground space-y-1 max-h-32 overflow-auto">
          {Array.isArray(deployment.logs)
            ? (deployment.logs as string[]).map((line, index) => <p key={`${line}-${index}`}>{line}</p>)
            : 'No logs yet'}
        </div>
      </div>
    </div>
  )
}
