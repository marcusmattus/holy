export type DeploymentInput = {
  projectId: string
  files: Record<string, string>
  target?: 'production' | 'preview'
  env?: Record<string, string>
}

export type DeploymentResult = {
  provider: string
  externalId?: string
  url?: string
  status: 'READY' | 'BUILDING' | 'FAILED'
  logs?: string[]
}

export interface DeploymentProvider {
  createDeployment(input: DeploymentInput): Promise<DeploymentResult>
  getDeploymentStatus(externalId: string): Promise<DeploymentResult>
}

export class SimulatedDeploymentProvider implements DeploymentProvider {
  async createDeployment(input: DeploymentInput): Promise<DeploymentResult> {
    return {
      provider: 'simulated',
      externalId: `sim-${input.projectId}`,
      url: `https://holy-${input.projectId}.vercel.app`,
      status: 'READY',
      logs: ['Simulated deployment created'],
    }
  }

  async getDeploymentStatus(externalId: string): Promise<DeploymentResult> {
    return {
      provider: 'simulated',
      externalId,
      url: `https://holy-${externalId.replace(/^sim-/, '')}.vercel.app`,
      status: 'READY',
      logs: ['Simulated deployment ready'],
    }
  }
}
