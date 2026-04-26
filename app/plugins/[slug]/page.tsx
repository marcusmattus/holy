import { notFound } from 'next/navigation'
import { getPluginBySlug } from '@/server/services/plugin.service'

export default async function PluginDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const plugin = getPluginBySlug(slug)

  if (!plugin) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8 text-[#F8F2E5]" style={{ fontFamily: 'Space Grotesk, var(--font-geist-sans)' }}>
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#C9A24A]/30 bg-[#111111]/90 p-6 shadow-[0_0_100px_rgba(201,162,74,0.1)]">
        <h1 className="text-3xl font-semibold">{plugin.title}</h1>
        <p className="mt-3 text-sm text-[#D0D0D0]">{plugin.description}</p>
      </div>
    </main>
  )
}
