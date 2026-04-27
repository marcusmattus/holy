export interface EnterpriseContractRecord {
  workspaceId: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED'
  uptimeTarget: string
  supportLevel: string
  responseTime: string
  mrrCents: number
}

export function getEnterpriseContract(workspaceId: string): EnterpriseContractRecord {
  return {
    workspaceId,
    status: 'DRAFT',
    uptimeTarget: '99.9%',
    supportLevel: 'Priority',
    responseTime: '4h',
    mrrCents: 0,
  }
}
