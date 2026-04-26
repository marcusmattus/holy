import type { ExportPayload, ExportProvider } from '@/server/export/export-provider'

export class S3ExportProvider implements ExportProvider {
  async run(payload: ExportPayload, config: Record<string, unknown>): Promise<void> {
    void payload
    void config
    throw new Error('S3 export provider shell only: not implemented in MVP')
  }
}
