import type { ExportPayload, ExportProvider } from '@/server/export/export-provider'

export class WebhookExportProvider implements ExportProvider {
  async run(payload: ExportPayload, config: Record<string, unknown>): Promise<void> {
    const url = config.url
    if (typeof url !== 'string' || !url.startsWith('http')) {
      throw new Error('Webhook destination requires a valid url')
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Webhook export failed with status ${response.status}`)
    }
  }
}
