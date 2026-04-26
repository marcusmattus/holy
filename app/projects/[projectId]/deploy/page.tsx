import { prisma } from '@/server/db/client'
import { DeploymentPanel } from '@/features/deployments/components/DeploymentPanel'

export const dynamic = 'force-dynamic'

export default async function ProjectDeploymentPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params

  const deployment = await prisma.deployment
    .findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })
    .catch(() => null)

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Deploy project</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Deploy, inspect build logs, and share your live URL.
          </p>
        </div>
        <DeploymentPanel projectId={projectId} initialDeployment={deployment} />
      </div>
    </div>
  )
}
