export interface HolyOSConfig {
  apiKey?: string
  baseUrl?: string
}

export interface HolyOSClient {
  auth: AuthNamespace
  projects: ProjectsNamespace
  analytics: AnalyticsNamespace
  store: StoreNamespace
  rewards: RewardsNamespace
  ads: AdsNamespace
  deploy: DeployNamespace
}

export interface AuthNamespace {
  signIn(email: string, password: string): Promise<{ token: string; user: User }>
  signUp(email: string, password: string, name: string): Promise<{ token: string; user: User }>
  signOut(): Promise<void>
  getSession(): Promise<Session | null>
  connectWallet(address: string): Promise<void>
}

export interface ProjectsNamespace {
  list(): Promise<Project[]>
  get(id: string): Promise<Project>
  create(data: CreateProjectInput): Promise<Project>
  update(id: string, data: Partial<CreateProjectInput>): Promise<Project>
  delete(id: string): Promise<void>
}

export interface AnalyticsNamespace {
  track(event: string, properties?: Record<string, unknown>): Promise<void>
  query(params: AnalyticsQueryParams): Promise<AnalyticsResult>
  getMetrics(projectId: string): Promise<ProjectMetrics>
}

export interface StoreNamespace {
  listApps(params?: StoreQueryParams): Promise<StoreApp[]>
  getApp(id: string): Promise<StoreApp>
  publishApp(data: PublishAppInput): Promise<StoreApp>
  purchaseApp(id: string): Promise<void>
}

export interface RewardsNamespace {
  getEarnings(): Promise<Earnings>
  claim(): Promise<ClaimResult>
  getPayoutHistory(): Promise<Payout[]>
}

export interface AdsNamespace {
  listCampaigns(): Promise<AdCampaign[]>
  getCampaignPerformance(id: string): Promise<CampaignPerformance>
  getAdZones(): Promise<AdZone[]>
}

export interface DeployNamespace {
  triggerBuild(projectId: string): Promise<Build>
  getBuildStatus(buildId: string): Promise<Build>
  getDomains(projectId: string): Promise<Domain[]>
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  walletAddress?: string
}

export interface Session {
  token: string
  user: User
  expiresAt: string
}

export interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
  url?: string
}

export interface CreateProjectInput {
  name: string
  description?: string
}

export interface AnalyticsQueryParams {
  projectId?: string
  from: string
  to: string
  metric: string
}

export interface AnalyticsResult {
  data: Array<{ date: string; value: number }>
  total: number
}

export interface ProjectMetrics {
  views: number
  visitors: number
  revenue: number
  bounceRate: number
}

export interface StoreQueryParams {
  category?: string
  search?: string
  page?: number
}

export interface StoreApp {
  id: string
  name: string
  description: string
  author: string
  price: number
  rating: number
  downloads: number
  category: string
  thumbnail?: string
}

export interface PublishAppInput {
  name: string
  description: string
  projectId: string
  price: number
  category: string
}

export interface Earnings {
  total: number
  pending: number
  paid: number
  currency: string
}

export interface ClaimResult {
  amount: number
  txHash: string
}

export interface Payout {
  id: string
  amount: number
  date: string
  txHash: string
  status: 'pending' | 'completed' | 'failed'
}

export interface AdCampaign {
  id: string
  name: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  status: 'active' | 'paused' | 'ended'
}

export interface CampaignPerformance {
  impressions: number
  clicks: number
  ctr: number
  revenue: number
}

export interface AdZone {
  id: string
  name: string
  type: string
  earnings: number
}

export interface Build {
  id: string
  projectId: string
  status: 'queued' | 'building' | 'success' | 'failed'
  startedAt?: string
  completedAt?: string
  url?: string
}

export interface Domain {
  id: string
  domain: string
  verified: boolean
}
