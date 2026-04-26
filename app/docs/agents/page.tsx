export const metadata = { title: 'Agent Docs — Holy' }

export default function AgentDocsPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-semibold">Agents & Workflows</h1>
      <p className="text-sm text-muted-foreground">
        Agents can be published, monetized, and installed in authorized workspaces.
        Workflows support approval gates for high-risk actions.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Paid listings require compliance approval before public release.</li>
        <li>Production deploy, patch apply, and pricing updates support manual approval gates.</li>
        <li>A/B testing suggestions never guarantee results.</li>
      </ul>
    </main>
  )
}
