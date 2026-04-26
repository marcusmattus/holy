export type ExportPayload = {
  workspaceId: string
  data: Record<string, unknown>
}

export interface ExportProvider {
  run(payload: ExportPayload, config: Record<string, unknown>): Promise<void>
}
