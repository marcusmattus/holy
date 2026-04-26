export interface RuntimeExecutionSummary {
  id: string
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
}

export interface WorkerHealthSummary {
  worker: string
  status: string
}

export interface PluginSummary {
  id: string
  slug: string
  title: string
}
