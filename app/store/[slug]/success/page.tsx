import Link from 'next/link'

type SuccessPageProps = {
  searchParams: Promise<{ install?: string; purchase?: string; ref?: string }>
}

export default async function ListingSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const action = params.purchase ? 'Purchase completed' : 'Install completed'

  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <div className="rounded-2xl border border-white/10 bg-card p-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Holy Store
        </p>
        <h1 className="mt-3 text-2xl font-bold">{action}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for supporting creators on Holy.
          {params.ref ? ` Referral applied: ${params.ref}.` : ''}
        </p>
        <Link
          href="/dashboard/store"
          className="mt-6 inline-flex rounded-lg border border-[#7C3AED]/60 px-4 py-2 text-sm font-medium hover:bg-[#7C3AED]/10"
        >
          Back to Store
        </Link>
      </div>
    </div>
  )
}
