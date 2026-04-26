const memoryStore = new Map<string, Map<string, unknown>>()

function getScopeKey(workspaceId: string | null | undefined, projectId?: string) {
  return `${workspaceId ?? 'global'}:${projectId ?? 'none'}`
}

export class AgentMemory {
  set(
    workspaceId: string | null | undefined,
    key: string,
    value: unknown,
    projectId?: string,
  ) {
    const scopeKey = getScopeKey(workspaceId, projectId)
    const scoped = memoryStore.get(scopeKey) ?? new Map<string, unknown>()
    scoped.set(key, value)
    memoryStore.set(scopeKey, scoped)
  }

  get(workspaceId: string | null | undefined, key: string, projectId?: string) {
    return memoryStore.get(getScopeKey(workspaceId, projectId))?.get(key)
  }
}
