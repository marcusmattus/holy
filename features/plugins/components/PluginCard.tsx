import type { PluginListingRecord } from '@/server/services/plugin.service'
import { PluginInstallButton } from './PluginInstallButton'

export function PluginCard({ plugin }: { plugin: PluginListingRecord }) {
  return (
    <article className="rounded-xl border border-[#C9A24A]/30 bg-[#121212]/70 backdrop-blur p-5">
      <h3 className="text-lg font-semibold text-[#F8F2E5]">{plugin.title}</h3>
      <p className="mt-2 text-sm text-[#D5D5D5]">{plugin.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {plugin.manifest.permissions.map((permission) => (
          <span key={permission} className="rounded-full border border-[#C9A24A]/40 px-2 py-1 text-xs text-[#C9A24A]">
            {permission}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <PluginInstallButton pluginId={plugin.id} />
      </div>
    </article>
  )
}
