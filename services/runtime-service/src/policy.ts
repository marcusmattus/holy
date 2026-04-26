export type RuntimeAction = 'read' | 'write' | 'network' | 'secret'

export interface RuntimePolicy {
  allowNetwork: boolean
  maxExecutionMs: number
  blockedActions: RuntimeAction[]
}

export const DEFAULT_RUNTIME_POLICY: RuntimePolicy = {
  allowNetwork: false,
  maxExecutionMs: 60_000,
  blockedActions: ['secret'],
}

export function validateRuntimePolicy(policy: RuntimePolicy): RuntimePolicy {
  return {
    ...DEFAULT_RUNTIME_POLICY,
    ...policy,
    blockedActions: Array.from(new Set(policy.blockedActions ?? DEFAULT_RUNTIME_POLICY.blockedActions)),
  }
}
