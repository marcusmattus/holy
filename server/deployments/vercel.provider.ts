import type {
  DeploymentInput,
  DeploymentProvider,
  DeploymentResult,
} from './deployment-provider'

type VercelConfig = {
  token: string
  teamId?: string
  projectId: string
}

export class VercelDeploymentProvider implements DeploymentProvider {
  constructor(private config: VercelConfig) {}

  private withTeam(path: string) {
    const url = new URL(`https://api.vercel.com${path}`)
    if (this.config.teamId) {
      url.searchParams.set('teamId', this.config.teamId)
    }
    return url.toString()
  }

  async createDeployment(input: DeploymentInput): Promise<DeploymentResult> {
    const files = Object.entries(input.files).map(([file, data]) => ({
      file: file.replace(/^\//, ''),
      data,
    }))

    const res = await fetch(this.withTeam('/v13/deployments'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `holy-${input.projectId}`,
        project: this.config.projectId,
        files,
        target: input.target === 'production' ? 'production' : undefined,
        env: input.env,
        projectSettings: {
          framework: 'nextjs',
        },
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      return {
        provider: 'vercel',
        status: 'FAILED',
        logs: [`Vercel deployment failed: ${error}`],
      }
    }

    const data = await res.json()

    return {
      provider: 'vercel',
      externalId: data.id,
      url: data.url ? `https://${data.url}` : undefined,
      status: data.readyState === 'READY' ? 'READY' : 'BUILDING',
      logs: ['Vercel deployment created'],
    }
  }

  async getDeploymentStatus(externalId: string): Promise<DeploymentResult> {
    const res = await fetch(this.withTeam(`/v13/deployments/${externalId}`), {
      headers: {
        Authorization: `Bearer ${this.config.token}`,
      },
    })

    if (!res.ok) {
      return {
        provider: 'vercel',
        externalId,
        status: 'FAILED',
        logs: ['Unable to fetch deployment status'],
      }
    }

    const data = await res.json()
    const status =
      data.readyState === 'READY'
        ? 'READY'
        : data.readyState === 'ERROR'
          ? 'FAILED'
          : 'BUILDING'

    return {
      provider: 'vercel',
      externalId,
      url: data.url ? `https://${data.url}` : undefined,
      status,
      logs: [`Vercel status: ${data.readyState}`],
    }
  }
}
