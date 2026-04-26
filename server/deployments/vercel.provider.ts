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

  private withTeam(url: string) {
    if (!this.config.teamId) {
      return url
    }

    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}teamId=${encodeURIComponent(this.config.teamId)}`
  }

  async createDeployment(input: DeploymentInput): Promise<DeploymentResult> {
    const files = Object.entries(input.files).map(([file, data]) => ({
      file: file.replace(/^\//, ''),
      data,
    }))

    const res = await fetch(this.withTeam('https://api.vercel.com/v13/deployments'), {
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

    const data = (await res.json()) as { id: string; url?: string; readyState?: string }

    return {
      provider: 'vercel',
      externalId: data.id,
      url: data.url ? `https://${data.url}` : undefined,
      status: data.readyState === 'READY' ? 'READY' : 'BUILDING',
      logs: ['Vercel deployment created'],
    }
  }

  async getDeploymentStatus(externalId: string): Promise<DeploymentResult> {
    const res = await fetch(
      this.withTeam(`https://api.vercel.com/v13/deployments/${externalId}`),
      {
        headers: {
          Authorization: `Bearer ${this.config.token}`,
        },
      },
    )

    if (!res.ok) {
      return {
        provider: 'vercel',
        externalId,
        status: 'FAILED',
        logs: ['Unable to fetch deployment status'],
      }
    }

    const data = (await res.json()) as { url?: string; readyState?: string }

    return {
      provider: 'vercel',
      externalId,
      url: data.url ? `https://${data.url}` : undefined,
      status:
        data.readyState === 'READY'
          ? 'READY'
          : data.readyState === 'ERROR'
            ? 'FAILED'
            : 'BUILDING',
      logs: [`Vercel status: ${data.readyState ?? 'UNKNOWN'}`],
    }
  }
}
