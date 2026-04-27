import { PluginMarketplace } from '@/features/plugins/components/PluginMarketplace'

export const metadata = { title: 'Plugins — Holy' }

export default function PluginsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8 text-[#F8F2E5]" style={{ fontFamily: 'Space Grotesk, var(--font-geist-sans)' }}>
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#C9A24A]/30 bg-gradient-to-b from-[#131313] to-[#0D0D0D] p-6 shadow-[0_0_120px_rgba(201,162,74,0.12)]">
        <PluginMarketplace />
      </div>
    </main>
  )
}
