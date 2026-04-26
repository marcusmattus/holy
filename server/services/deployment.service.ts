import { prisma } from '@/server/db/client'
import { getDeploymentProvider } from '@/server/deployments/provider-factory'
import type { DeploymentInput } from '@/server/deployments/deployment-provider'
import { logger } from '@/lib/logger'

const UNSAFE_ENV_KEY = /(?:SECRET|TOKEN|PASSWORD|PRIVATE|DATABASE_URL|API_KEY|KEY)$/i

function normalizeFiles(files: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(files).filter(
      ([file, content]) => Boolean(file.trim()) && typeof content === 'string' && content.trim().length > 0,
    ),
  )
}

function sanitizeEnv(env: DeploymentInput['env']) {
  if (!env) return undefined
  return Object.fromEntries(
    Object.entries(env).filter(([key, value]) => {
      if (!key || !value) return false
      if (!/^[A-Z][A-Z0-9_]*$/.test(key)) return false
      if (key.startsWith('NEXT_PUBLIC_')) return true
      return !UNSAFE_ENV_KEY.test(key)
    }),
  )
}

export async function createDeployment(input: DeploymentInput) {
  const files = normalizeFiles(input.files)
  if (Object.keys(files).length === 0) {
    throw new Error('Cannot deploy empty files')
  }

  const provider = getDeploymentProvider()
  const env = sanitizeEnv(input.env)
  const created = await provider.createDeployment({ ...input, files, env })

  const deployment = await prisma.deployment.create({
    data: {
      projectId: input.projectId,
      provider: created.provider,
      externalId: created.externalId,
      url: created.url,
      status: created.status,
      logs: created.logs,
    },
  })

  await prisma.analyticsEvent.create({
    data: {
      eventType: 'DEPLOYMENT_CREATED',
      projectId: input.projectId,
      metadata: {
        provider: created.provider,
        status: created.status,
      },
    },
  })

  if (created.status === 'FAILED') {
    logger.error('deployment_failed', {
      projectId: input.projectId,
      provider: created.provider,
      logs: created.logs,
    })
    return deployment
  }

  if (created.externalId) {
    const status = await pollDeploymentStatus(deployment.id, created.externalId)
    return status
  }

  return deployment
}

export async function pollDeploymentStatus(deploymentId: string, externalId: string) {
  const provider = getDeploymentProvider()
  let latest = await provider.getDeploymentStatus(externalId)

  for (let attempt = 0; attempt < 2 && latest.status === 'BUILDING'; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 120))
    latest = await provider.getDeploymentStatus(externalId)
  }

  return prisma.deployment.update({
    where: { id: deploymentId },
    data: {
      status: latest.status,
      logs: latest.logs,
      url: latest.url ?? undefined,
    },
  })
}
