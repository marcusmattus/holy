import TemplateDetailContainer from './TemplateDetailContainer'

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <TemplateDetailContainer slug={slug} />
    </div>
  )
}
