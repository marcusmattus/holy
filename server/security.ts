export interface RequestIdentity {
  userId: string
  role: 'admin' | 'member'
  workspaceRole: 'admin' | 'member'
}

const ADMIN_ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN

function validateAdminToken(headers: Pick<Headers, 'get'>) {
  const adminToken = headers.get('x-admin-token')
  if (!ADMIN_ACCESS_TOKEN || adminToken !== ADMIN_ACCESS_TOKEN) {
    throw new Error('Admin token is invalid')
  }
}

export function getRequestIdentity(request: Request): RequestIdentity {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    throw new Error('Authentication required')
  }

  const role = request.headers.get('x-user-role') === 'admin' ? 'admin' : 'member'
  const workspaceRole = request.headers.get('x-workspace-role') === 'admin' ? 'admin' : 'member'
  return { userId, role, workspaceRole }
}

export function assertAdmin(request: Request) {
  const identity = getRequestIdentity(request)
  if (identity.role !== 'admin') {
    throw new Error('Admin access required')
  }
  validateAdminToken(request.headers)

  return identity
}

export function assertAdminHeaders(headers: Pick<Headers, 'get'>) {
  const role = headers.get('x-user-role')
  if (role !== 'admin') {
    throw new Error('Admin access required')
  }

  validateAdminToken(headers)
}
