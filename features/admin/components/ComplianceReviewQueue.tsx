type QueueItem = {
  id: string
  targetType: string
  targetId: string
  riskLevel: string
  status: string
}

export function ComplianceReviewQueue({ reviews }: { reviews: QueueItem[] }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-lg font-semibold">Compliance queue</h2>
      <div className="mt-3 space-y-2">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-md border border-white/10 p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span>{review.targetType}</span>
              <span className="rounded-full border border-[#C9A24A]/30 px-2 py-1 text-[#C9A24A]">
                {review.riskLevel}
              </span>
              <span className="rounded-full border border-white/20 px-2 py-1">
                {review.status}
              </span>
            </div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{review.targetId}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
