export function getRequestUserId(request: Request): string {
  return request.headers.get('x-user-id') ?? 'demo-user'
}

export function getRequestWorkspaceId(request: Request): string | null {
  return request.headers.get('x-workspace-id')
}
