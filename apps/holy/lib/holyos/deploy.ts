export interface Build {
  id: string
  projectId: string
  status: 'queued' | 'building' | 'success' | 'failed'
  url?: string
}

export async function triggerBuild(_projectId: string): Promise<Build> {
  throw new Error('HolyOS deploy: not yet implemented')
}

export async function getBuildStatus(_buildId: string): Promise<Build | null> {
  return null
}
