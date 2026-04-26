import TemplateGrid from '@/features/templates/components/TemplateGrid'

export const metadata = { title: 'Templates — Holy' }

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 space-y-4">
      <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]">Holy store</p>
      <h1 className="text-2xl font-semibold">Template Marketplace</h1>
      <p className="text-sm text-white/70">Fork, remix, and scale product creation with reusable templates.</p>
      <TemplateGrid />
    </div>
  )
}
