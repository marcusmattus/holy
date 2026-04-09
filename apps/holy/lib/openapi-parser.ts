// HolyOS API endpoint definitions
// This file describes the HolyOS REST API structure for documentation and tooling.

export interface APIEndpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  description?: string
  category: string
  parameters?: {
    name: string
    in: 'path' | 'query' | 'header' | 'body'
    required: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any
    description?: string
  }[]
}

export interface APICategory {
  id: string
  name: string
  endpoints: APIEndpoint[]
}

const HOLYOS_ENDPOINTS: APICategory[] = [
  {
    id: 'auth',
    name: 'Auth',
    endpoints: [
      { id: 'auth.signIn', name: 'Sign In', method: 'POST', path: '/auth/sign-in', category: 'Auth', description: 'Authenticate with email and password.' },
      { id: 'auth.signUp', name: 'Sign Up', method: 'POST', path: '/auth/sign-up', category: 'Auth', description: 'Register a new account.' },
      { id: 'auth.signOut', name: 'Sign Out', method: 'POST', path: '/auth/sign-out', category: 'Auth', description: 'Invalidate the current session.' },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    endpoints: [
      { id: 'projects.list', name: 'List Projects', method: 'GET', path: '/projects', category: 'Projects' },
      { id: 'projects.get', name: 'Get Project', method: 'GET', path: '/projects/{id}', category: 'Projects' },
      { id: 'projects.create', name: 'Create Project', method: 'POST', path: '/projects', category: 'Projects' },
      { id: 'projects.update', name: 'Update Project', method: 'PATCH', path: '/projects/{id}', category: 'Projects' },
      { id: 'projects.delete', name: 'Delete Project', method: 'DELETE', path: '/projects/{id}', category: 'Projects' },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    endpoints: [
      { id: 'analytics.getMetrics', name: 'Get Metrics', method: 'GET', path: '/analytics/{projectId}/metrics', category: 'Analytics' },
      { id: 'analytics.query', name: 'Query Analytics', method: 'POST', path: '/analytics/query', category: 'Analytics' },
    ],
  },
  {
    id: 'store',
    name: 'Store',
    endpoints: [
      { id: 'store.listApps', name: 'List Apps', method: 'GET', path: '/store/apps', category: 'Store' },
      { id: 'store.getApp', name: 'Get App', method: 'GET', path: '/store/apps/{id}', category: 'Store' },
      { id: 'store.publishApp', name: 'Publish App', method: 'POST', path: '/store/apps', category: 'Store' },
    ],
  },
  {
    id: 'rewards',
    name: 'Rewards',
    endpoints: [
      { id: 'rewards.getEarnings', name: 'Get Earnings', method: 'GET', path: '/rewards/earnings', category: 'Rewards' },
      { id: 'rewards.claim', name: 'Claim Rewards', method: 'POST', path: '/rewards/claim', category: 'Rewards' },
      { id: 'rewards.getPayoutHistory', name: 'Payout History', method: 'GET', path: '/rewards/payouts', category: 'Rewards' },
    ],
  },
  {
    id: 'deploy',
    name: 'Deploy',
    endpoints: [
      { id: 'deploy.triggerBuild', name: 'Trigger Build', method: 'POST', path: '/deploy/{projectId}/build', category: 'Deploy' },
      { id: 'deploy.getBuildStatus', name: 'Get Build Status', method: 'GET', path: '/deploy/builds/{buildId}', category: 'Deploy' },
      { id: 'deploy.getDomains', name: 'Get Domains', method: 'GET', path: '/deploy/{projectId}/domains', category: 'Deploy' },
    ],
  },
]

export function parseOpenAPISpec(): APICategory[] {
  return HOLYOS_ENDPOINTS
}
