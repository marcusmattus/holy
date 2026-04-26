export type DeploymentInput = {
  projectId: string
  files: Record<string, string>
  env?: Record<string, string>
  target?: 'preview' | 'production'
}

export type DeploymentResult = {
  provider: string
  externalId?: string
  url?: string
  status: 'QUEUED' | 'BUILDING' | 'READY' | 'FAILED'
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
      externalId: `sim_${input.projectId}_${Date.now()}`,
      url: `https://${input.projectId}.holy.app`,
      status: 'READY',
      logs: ['Simulated build completed'],
    }
  }

  async getDeploymentStatus(externalId: string): Promise<DeploymentResult> {
    return {
      provider: 'simulated',
      externalId,
      status: 'READY',
      logs: ['Deployment ready'],
    }
  }
}
