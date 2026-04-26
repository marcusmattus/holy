import type { DeploymentInput, DeploymentProvider, DeploymentResult } from './deployment-provider'

export class VercelDeploymentProvider implements DeploymentProvider {
  async createDeployment(input: DeploymentInput): Promise<DeploymentResult> {
    void input
    throw new Error('Vercel provider is not configured yet')
  }

  async getDeploymentStatus(externalId: string): Promise<DeploymentResult> {
    void externalId
    throw new Error('Vercel provider is not configured yet')
  }
}
