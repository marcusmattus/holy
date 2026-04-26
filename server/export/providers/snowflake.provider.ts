import type { ExportPayload, ExportProvider } from '@/server/export/export-provider'

export class SnowflakeExportProvider implements ExportProvider {
  async run(payload: ExportPayload, config: Record<string, unknown>): Promise<void> {
    void payload
    void config
    throw new Error('Snowflake export provider shell only: not implemented in MVP')
  }
}
