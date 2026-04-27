import { listPlugins } from '@/server/services/plugin.service'
import { PluginCard } from './PluginCard'

export function PluginMarketplace() {
  const plugins = listPlugins()

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold text-[#F8F2E5]">Plugin Marketplace</h1>
        <p className="mt-2 text-sm text-[#C7C7C7]">Install verified plugin extensions for generated Holy apps.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {plugins.map((plugin) => (
          <PluginCard key={plugin.id} plugin={plugin} />
        ))}
      </div>
    </section>
  )
}
