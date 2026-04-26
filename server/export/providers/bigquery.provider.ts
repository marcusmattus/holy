import type { ExportPayload, ExportProvider } from '@/server/export/export-provider'

export class BigQueryExportProvider implements ExportProvider {
  async run(payload: ExportPayload, config: Record<string, unknown>): Promise<void> {
    void payload
    void config
    throw new Error('BigQuery/Snowflake provider shell only: not implemented in MVP')
  }
}
