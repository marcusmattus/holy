import { WorkspaceRole } from '@prisma/client'
import { prisma } from '@/server/db'

const roleWeight: Record<WorkspaceRole, number> = {
  VIEWER: 1,
  MEMBER: 2,
  ADMIN: 3,
  OWNER: 4,
}

export async function requireWorkspaceRole(
  workspaceId: string | undefined,
  userId: string,
  minimumRole: WorkspaceRole,
) {
  if (!workspaceId) return true
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
  })
  if (!membership) return false
  return roleWeight[membership.role] >= roleWeight[minimumRole]
}
