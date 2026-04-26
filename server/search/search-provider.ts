export type MarketplaceSearchItem = {
  id: string
  type: 'StoreListing' | 'Template' | 'AgentListing' | 'WorkflowTemplate' | 'CreatorProfile' | 'IntegrationListing'
  title: string
  description: string
  score: number
  isPublic: boolean
  isCertified?: boolean
}

export interface SearchProvider {
  searchMarketplace(query: string, filters?: { type?: MarketplaceSearchItem['type'] }): Promise<MarketplaceSearchItem[]>
}
