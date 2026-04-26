export interface RequestIdentity {
  userId: string
  role: 'admin' | 'member'
  workspaceRole: 'admin' | 'member'
}

export function getRequestIdentity(request: Request): RequestIdentity {
  const userId = request.headers.get('x-user-id') ?? 'demo-user'
  const role = request.headers.get('x-user-role') === 'admin' ? 'admin' : 'member'
  const workspaceRole = request.headers.get('x-workspace-role') === 'admin' ? 'admin' : 'member'
  return { userId, role, workspaceRole }
}

export function assertAdmin(request: Request) {
  const identity = getRequestIdentity(request)
  if (identity.role !== 'admin') {
    throw new Error('Admin access required')
  }

  return identity
}
