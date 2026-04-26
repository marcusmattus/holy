import { prisma } from '@/server/db/client'
import { getDeploymentProvider } from '@/server/deployments/provider-factory'
import type { DeploymentInput } from '@/server/deployments/deployment-provider'
import { logger } from '@/lib/logger'

async function ensureProject(projectId: string) {
  const demoEmail = 'demo-user@holy.local'
  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      id: 'demo-user',
      email: demoEmail,
    },
  })

  await prisma.project.upsert({
    where: { id: projectId },
    update: {},
    create: {
      id: projectId,
      name: `Project ${projectId.slice(0, 8)}`,
      userId: demoUser.id,
    },
  })
}

function sanitizeEnvVars(envVars: Record<string, string> = {}) {
  const unsafePatterns = ['secret', 'token', 'password', 'key', 'api', 'private']
  const entries = Object.entries(envVars).filter(([key]) => {
    const normalized = key.toLowerCase()
    return !unsafePatterns.some((pattern) => normalized.includes(pattern))
  })

  return Object.fromEntries(entries)
}

export async function createDeployment(input: DeploymentInput) {
  if (!input.files || Object.keys(input.files).length === 0) {
    throw new Error('Cannot deploy empty file set')
  }

  await ensureProject(input.projectId)

  const provider = getDeploymentProvider()
  const deploymentResult = await provider.createDeployment({
    ...input,
    env: sanitizeEnvVars(input.env),
  })

  const deployment = await prisma.deployment.create({
    data: {
      projectId: input.projectId,
      provider: deploymentResult.provider,
      externalId: deploymentResult.externalId,
      url: deploymentResult.url,
      status: deploymentResult.status,
      logs: deploymentResult.logs ?? [],
    },
  })

  await prisma.analyticsEvent.create({
    data: {
      projectId: input.projectId,
      eventType: 'DEPLOYMENT_CREATED',
    },
  })

  logger.info({
    event: 'deployment.create',
    message: 'Deployment created',
    metadata: {
      projectId: input.projectId,
      provider: deploymentResult.provider,
      status: deploymentResult.status,
      env: sanitizeEnvVars(input.env),
    },
  })

  return { ...deploymentResult, deploymentId: deployment.id }
}

export async function pollDeploymentStatus(deploymentId: string) {
  const deployment = await prisma.deployment.findUniqueOrThrow({
    where: { id: deploymentId },
  })

  if (!deployment.externalId) {
    return deployment
  }

  const provider = getDeploymentProvider()
  const statusResult = await provider.getDeploymentStatus(deployment.externalId)

  return prisma.deployment.update({
    where: { id: deploymentId },
    data: {
      status: statusResult.status,
      url: statusResult.url,
      logs: statusResult.logs ?? [],
    },
  })
}
