export type RuntimePolicy = {
  timeoutMs: number
  memoryMb: number
  allowNetwork: boolean
  allowFilesystem: boolean
  allowEnv: boolean
  allowedTools: string[]
}

export const DEFAULT_RUNTIME_POLICY: RuntimePolicy = {
  timeoutMs: 5_000,
  memoryMb: 64,
  allowNetwork: false,
  allowFilesystem: false,
  allowEnv: false,
  allowedTools: [],
}
