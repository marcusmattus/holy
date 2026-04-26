export function EnterpriseOverview() {
  const sections = [
    'Workspace members',
    'Roles & invites',
    'Audit logs',
    'API keys',
    'Security settings',
    'White-label config',
    'Usage and billing',
  ]

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Enterprise Overview</h2>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {sections.map((section) => (
          <li key={section}>• {section}</li>
        ))}
      </ul>
    </section>
  )
}
