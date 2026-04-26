'use client'

import { useState } from 'react'
import type { Deployment } from '@prisma/client'
import { DeploymentStatusCard } from './DeploymentStatusCard'

type DeployTarget = 'preview' | 'production'

export function DeploymentPanel({
  projectId,
  initialDeployment,
}: {
  projectId: string
  initialDeployment: Deployment | null
}) {
  const [deployment, setDeployment] = useState<Deployment | null>(initialDeployment)
  const [isDeploying, setIsDeploying] = useState<DeployTarget | null>(null)

  async function runDeploy(target: DeployTarget) {
    setIsDeploying(target)
    try {
      const createRes = await fetch(`/api/projects/${projectId}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      })

      const createData = await createRes.json()
      const created = createData.deployment as Deployment
      setDeployment(created)

      if (created?.id) {
        const statusRes = await fetch(`/api/deployments/${created.id}`)
        const statusData = await statusRes.json()
        setDeployment(statusData.deployment as Deployment)
      }
    } finally {
      setIsDeploying(null)
    }
  }

  async function copyLink() {
    if (!deployment?.url) return
    await navigator.clipboard.writeText(deployment.url)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#D4AF37]/30 bg-card/70 p-4 backdrop-blur-sm">
        <h2 className="text-lg font-semibold">Deployment</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Publish preview or production builds and monitor status.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => runDeploy('preview')}
            disabled={isDeploying !== null}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60"
          >
            {isDeploying === 'preview' ? 'Deploying preview...' : 'Deploy preview'}
          </button>
          <button
            onClick={() => runDeploy('production')}
            disabled={isDeploying !== null}
            className="rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-semibold text-black hover:bg-[#e0bb49] disabled:opacity-60"
          >
            {isDeploying === 'production' ? 'Deploying production...' : 'Deploy production'}
          </button>
          <button
            onClick={copyLink}
            disabled={!deployment?.url}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60"
          >
            Copy link
          </button>
          {deployment?.url ? (
            <a
              href={deployment.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Open live app
            </a>
          ) : null}
        </div>
      </div>

      <DeploymentStatusCard deployment={deployment} />
    </div>
  )
}
