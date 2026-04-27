import { listWorkerMetrics } from '@/server/workers/shared/worker-metrics'

export function QueueHealthPanel() {
  const metrics = listWorkerMetrics()

  return (
    <section className="rounded-xl border border-[#C9A24A]/30 bg-[#111]/80 p-5 backdrop-blur">
      <h3 className="text-lg font-medium text-[#F8F2E5]">Queue Health</h3>
      <p className="mt-2 text-xs text-[#BEBEBE]">Tracked queues: {metrics.length}</p>
    </section>
  )
}
