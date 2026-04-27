export function runRuntimePolicyCheck(input: { allowNetwork: boolean; hasSecretAccess: boolean }) {
  return {
    passed: !input.hasSecretAccess,
    reason: input.hasSecretAccess ? 'Runtime profile requests secret access' : undefined,
    network: input.allowNetwork,
  }
}
