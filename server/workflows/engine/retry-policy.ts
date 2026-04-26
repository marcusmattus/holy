export type RetryPolicy = {
  maxAttempts: number
  backoffMs: number
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  backoffMs: 250,
}

export function isTransientWorkflowError(error: unknown) {
  return error instanceof Error && /timeout|temporary|network/i.test(error.message)
}
