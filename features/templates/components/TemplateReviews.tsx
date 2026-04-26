"use client"

type Review = {
  id: string
  rating: number
  body?: string | null
}

export default function TemplateReviews({ reviews }: { reviews: Review[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#C9A24A]">Template reviews</h3>
      <div className="space-y-2">
        {reviews.length === 0 ? (
          <p className="text-xs text-white/50">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-[#C9A24A]">{'★'.repeat(review.rating)}</p>
              {review.body ? <p className="mt-1 text-xs text-white/75">{review.body}</p> : null}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
