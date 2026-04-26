import { env } from '@/lib/env'
import { SimulatedDeploymentProvider } from './deployment-provider'
import { VercelDeploymentProvider } from './vercel.provider'

export function getDeploymentProvider() {
  if (env.VERCEL_TOKEN && env.VERCEL_PROJECT_ID) {
    return new VercelDeploymentProvider({
      token: env.VERCEL_TOKEN,
      teamId: env.VERCEL_TEAM_ID,
      projectId: env.VERCEL_PROJECT_ID,
    })
  }

  return new SimulatedDeploymentProvider()
}
