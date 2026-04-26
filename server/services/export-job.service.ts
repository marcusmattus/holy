import { prisma } from '@/server/db'
import { Prisma } from '@prisma/client'
import { WebhookExportProvider } from '@/server/export/providers/webhook.provider'
import { S3ExportProvider } from '@/server/export/providers/s3.provider'
import { BigQueryExportProvider } from '@/server/export/providers/bigquery.provider'

const providers: Record<'WEBHOOK' | 'S3' | 'BIGQUERY' | 'SNOWFLAKE', { run: (payload: { workspaceId: string; data: Record<string, unknown> }, config: Record<string, unknown>) => Promise<void> }> = {
  WEBHOOK: new WebhookExportProvider(),
  S3: new S3ExportProvider(),
  BIGQUERY: new BigQueryExportProvider(),
  SNOWFLAKE: new BigQueryExportProvider(),
}

export async function createExportDestination(input: {
  workspaceId: string
  type: 'WEBHOOK' | 'S3' | 'BIGQUERY' | 'SNOWFLAKE'
  name: string
  config: Record<string, unknown>
}) {
  return prisma.exportDestination.create({
    data: {
      ...input,
      config: input.config as Prisma.InputJsonValue,
    },
  })
}

export async function createExportJob(input: {
  destinationId: string
  payload: Record<string, unknown>
}) {
  return prisma.exportJob.create({
    data: {
      destinationId: input.destinationId,
      payload: input.payload as Prisma.InputJsonValue,
      status: 'PENDING',
    },
  })
}

export async function runExportJob(exportJobId: string) {
  const job = await prisma.exportJob.findUnique({
    where: { id: exportJobId },
    include: { destination: true },
  })

  if (!job) throw new Error('Export job not found')

  await prisma.exportJob.update({
    where: { id: exportJobId },
    data: { status: 'RUNNING', startedAt: new Date(), error: null },
  })

  try {
    const provider = providers[job.destination.type]
    await provider.run(
      {
        workspaceId: job.destination.workspaceId,
        data: (job.payload as Record<string, unknown>) ?? {},
      },
      (job.destination.config as Record<string, unknown>) ?? {},
    )

    return prisma.exportJob.update({
      where: { id: exportJobId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })
  } catch (error) {
    return prisma.exportJob.update({
      where: { id: exportJobId },
      data: {
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown export error',
        completedAt: new Date(),
      },
    })
  }
}
