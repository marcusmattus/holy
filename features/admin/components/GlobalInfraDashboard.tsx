import { QueueHealthPanel } from './QueueHealthPanel'
import { RuntimeClusterPanel } from './RuntimeClusterPanel'
import { RegionalDataPanel } from './RegionalDataPanel'
import { SettlementRolloutPanel } from './SettlementRolloutPanel'

export function GlobalInfraDashboard() {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-[#F8F2E5]">Global Infrastructure</h1>
        <p className="mt-2 text-sm text-[#BEBEBE]">Operator visibility for workers, runtime, regions, indexing, and settlement pilot status.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <QueueHealthPanel />
        <RuntimeClusterPanel />
        <RegionalDataPanel />
        <SettlementRolloutPanel />
      </div>
    </section>
  )
}
