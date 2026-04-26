export type RetryPolicy = {
  maxAttempts: number
  backoffMs: number
}

export class TransientWorkflowError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TransientWorkflowError'
  }
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  backoffMs: 250,
}

export function isTransientWorkflowError(error: unknown) {
  return error instanceof TransientWorkflowError
}
