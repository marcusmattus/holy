export function GrowthRecommendations({ recommendations }: { recommendations: string[] }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
      <h3 className="text-sm font-semibold">Holy Insights</h3>
      <p className="text-xs text-muted-foreground mt-1">
        Product-focused suggestions to improve growth loops. These are not financial guarantees.
      </p>
      <ul className="mt-3 space-y-2">
        {recommendations.length > 0 ? (
          recommendations.map((item) => (
            <li key={item} className="text-sm rounded-lg border border-border/50 bg-background/40 p-2">
              {item}
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground">No recommendations yet. Keep shipping.</li>
        )}
      </ul>
    </div>
  )
}
