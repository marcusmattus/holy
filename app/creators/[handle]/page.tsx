import CreatorPageClient from './CreatorPageClient'

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <CreatorPageClient handle={handle} />
    </div>
  )
}
