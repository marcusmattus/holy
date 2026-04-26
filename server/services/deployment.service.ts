import { prisma } from '@/server/db/client'
import { getProjectFileMap } from '@/server/services/project-file.service'
import { SimulatedDeploymentProvider } from '@/server/deployments/deployment-provider'
import { VercelDeploymentProvider } from '@/server/deployments/vercel.provider'
import { trackEvent } from '@/server/services/analytics.service'

const fallbackDeployments = new Map<string, Record<string, unknown>>()

function getDeploymentProvider() {
  if (process.env.VERCEL_TOKEN && process.env.VERCEL_TEAM_ID) {
    return new VercelDeploymentProvider()
  }
  return new SimulatedDeploymentProvider()
}

export async function deployProject(input: {
  projectId: string
  target?: 'preview' | 'production'
}) {
  const provider = getDeploymentProvider()
  const files = await getProjectFileMap(input.projectId)

  let created: { id: string } | null = null

  try {
    created = await prisma.deployment.create({
      data: {
        projectId: input.projectId,
        provider: provider instanceof VercelDeploymentProvider ? 'vercel' : 'simulated',
        target: input.target === 'production' ? 'PRODUCTION' : 'PREVIEW',
        status: 'QUEUED',
        logs: ['Deployment queued'],
      },
    })
  } catch {
    created = { id: `sim_local_${Date.now()}` }
  }

  try {
    const result = await provider.createDeployment({
      projectId: input.projectId,
      files,
      target: input.target,
    })

    const deployment = await prisma.deployment
      .update({
        where: { id: created.id },
        data: {
          provider: result.provider,
          externalId: result.externalId,
          url: result.url,
          status: result.status,
          logs: result.logs ?? [],
        },
      })
      .catch(() => ({
        id: created.id,
        projectId: input.projectId,
        provider: result.provider,
        externalId: result.externalId ?? null,
        url: result.url ?? null,
        status: result.status,
        target: input.target === 'production' ? 'PRODUCTION' : 'PREVIEW',
        logs: result.logs ?? [],
      }))

    fallbackDeployments.set(created.id, deployment as Record<string, unknown>)

    await trackEvent({
      projectId: input.projectId,
      eventName: 'DEPLOYMENT_CREATED',
      metadata: {
        deploymentId: deployment.id,
        target: deployment.target,
        status: deployment.status,
      },
    }).catch(() => null)

    return deployment
  } catch (error) {
    const failedData = {
      id: created.id,
      projectId: input.projectId,
      provider: provider instanceof VercelDeploymentProvider ? 'vercel' : 'simulated',
      externalId: null,
      url: null,
      status: 'FAILED',
      target: input.target === 'production' ? 'PRODUCTION' : 'PREVIEW',
      logs: [
        'Deployment failed',
        error instanceof Error ? error.message : 'Unknown deployment error',
      ],
    }

    fallbackDeployments.set(created.id, failedData)

    return prisma.deployment
      .update({
        where: { id: created.id },
        data: {
          status: 'FAILED',
          logs: failedData.logs,
        },
      })
      .catch(() => failedData)
  }
}

export async function getDeployment(deploymentId: string) {
  return prisma.deployment
    .findUniqueOrThrow({ where: { id: deploymentId } })
    .catch(() => {
      const fallback = fallbackDeployments.get(deploymentId)
      if (!fallback) {
        throw new Error('Deployment not found')
      }
      return fallback
    })
}
