import { createServer } from 'node:http'
import { healthResponse, metricsResponse, readinessResponse } from './health'
import { consumeQueue, type QueueJob } from './queue-consumer'
import { registerGracefulShutdown } from './shutdown'
import type { RuntimeExecutionPolicy } from './policy'
import { executeRuntimeJob } from './runtime-executor'

export type RuntimeMode = 'http' | 'queue'

export interface RuntimeClusterConfig {
  mode: RuntimeMode
  queueJobs?: QueueJob[]
  port?: number
}

export async function runRuntimeCluster(config: RuntimeClusterConfig) {
  const server = createServer(async (request, response) => {
    if (request.url === '/health') {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(healthResponse()))
      return
    }

    if (request.url === '/ready') {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(readinessResponse()))
      return
    }

    if (request.url === '/metrics') {
      response.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' })
      response.end(metricsResponse())
      return
    }

    if (request.url === '/execute' && request.method === 'POST') {
      const chunks: Buffer[] = []
      request.on('data', (chunk) => chunks.push(chunk))
      request.on('end', async () => {
        const body = JSON.parse(Buffer.concat(chunks).toString() || '{}') as {
          workspaceId: string
          tenantId: string
          payload?: Record<string, unknown>
        }

        const policy: RuntimeExecutionPolicy = {
          workspaceId: body.workspaceId,
          tenantId: body.tenantId,
          maxConcurrentExecutions: 3,
          timeoutMs: 30_000,
          isolationMode: 'sandboxed',
        }

        try {
          const result = await executeRuntimeJob(
            {
              workspaceId: body.workspaceId,
              tenantId: body.tenantId,
              jobId: `http-${Date.now()}`,
              payload: body.payload ?? {},
            },
            policy,
            async (context) => ({ ok: true, context: context.payload }),
          )

          response.writeHead(200, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify(result))
        } catch (error) {
          response.writeHead(400, { 'Content-Type': 'application/json' })
          response.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'execution-failed',
            }),
          )
        }
      })
      return
    }

    response.writeHead(404).end()
  })

  registerGracefulShutdown(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  })

  if (config.mode === 'queue' && config.queueJobs) {
    await consumeQueue(config.queueJobs, (workspaceId, tenantId): RuntimeExecutionPolicy => ({
      workspaceId,
      tenantId,
      maxConcurrentExecutions: 3,
      timeoutMs: 30_000,
      isolationMode: 'sandboxed',
    }))
  } else {
    await new Promise<void>((resolve) => {
      server.listen(config.port ?? 3000, () => resolve())
    })
  }

  return {
    health: healthResponse(),
    ready: readinessResponse(),
    metrics: metricsResponse(),
  }
}
