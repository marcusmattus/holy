export default async function WhiteLabelDomainPage({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const { domain } = await params

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-3xl font-bold">{domain} Storefront</h1>
      <p className="text-muted-foreground">
        This white-label store view is branded per workspace domain.
      </p>
    </div>
  )
}
