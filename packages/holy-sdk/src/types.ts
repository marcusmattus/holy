export interface RuntimeClusterNode {
  id: string
  provider: string
  region: string
  endpoint: string
  status: string
}

export interface WorkerPool {
  id: string
  name: string
  status: string
}

export interface ProcurementRequestInput {
  workspaceId: string
  assetType: string
  assetId: string
  amountCents: number
}
