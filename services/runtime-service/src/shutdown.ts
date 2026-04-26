import { structuredLog } from './telemetry'

export function registerGracefulShutdown(cleanup: () => Promise<void>) {
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']

  signals.forEach((signal) => {
    process.on(signal, async () => {
      structuredLog('runtime.shutdown.start', { signal })
      await cleanup()
      structuredLog('runtime.shutdown.complete', { signal })
      process.exit(0)
    })
  })
}
