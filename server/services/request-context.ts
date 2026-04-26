export function getRequestUserId(request: Request): string {
  const userId = request.headers.get('x-user-id')
  if (userId) return userId

  if (process.env.ALLOW_DEMO_USER_CONTEXT === 'true') {
    return 'demo-user'
  }

  throw new Error('Missing authenticated user context')
}

export function getRequestWorkspaceId(request: Request): string | null {
  return request.headers.get('x-workspace-id')
}
