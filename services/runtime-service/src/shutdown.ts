import { structuredLog } from './telemetry'

export function registerGracefulShutdown(cleanup: () => Promise<void>) {
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
  let shuttingDown = false

  signals.forEach((signal) => {
    process.on(signal, async () => {
      if (shuttingDown) {
        return
      }
      shuttingDown = true
      structuredLog('runtime.shutdown.start', { signal })
      await cleanup()
      structuredLog('runtime.shutdown.complete', { signal })
      process.exit(0)
    })
  })
}
