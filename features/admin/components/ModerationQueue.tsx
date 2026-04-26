const moderationActions = [
  'Hide listing/template',
  'Dismiss report',
  'Assign reviewer',
  'Mark resolved',
  'Add admin note',
]

export function ModerationQueue() {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Moderation Queue</h2>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {moderationActions.map((action) => (
          <li key={action}>• {action}</li>
        ))}
      </ul>
    </section>
  )
}
