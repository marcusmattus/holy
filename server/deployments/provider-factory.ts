import { SimulatedDeploymentProvider } from './deployment-provider'
import { VercelDeploymentProvider } from './vercel.provider'

export function getDeploymentProvider() {
  if (process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID) {
    return new VercelDeploymentProvider({
      token: process.env.VERCEL_TOKEN,
      teamId: process.env.VERCEL_TEAM_ID,
      projectId: process.env.VERCEL_PROJECT_ID,
    })
  }

  return new SimulatedDeploymentProvider()
}
