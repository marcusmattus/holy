export function runPermissionsCheck(requestedPermissions: string[]) {
  const blocked = requestedPermissions.filter((permission) => permission.startsWith('admin:'))
  return {
    passed: blocked.length === 0,
    blocked,
  }
}
