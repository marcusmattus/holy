export async function collectAccessControlEvidence() {
  return {
    control: 'access-control',
    collectedAt: new Date().toISOString(),
    data: {
      workspaceRoleModel: 'admin/member',
      ssoEnabled: false,
      secrets: '[REDACTED]',
    },
    immutable: true,
  }
}
