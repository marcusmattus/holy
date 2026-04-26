export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Holy Public API</h1>
      <p className="text-sm text-muted-foreground">
        Authenticate with Bearer API keys and scoped access on /api/v1 endpoints.
      </p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• Projects: create, get, generate, deploy</li>
        <li>• Templates: list, fork/create</li>
        <li>• Store listings: list</li>
        <li>• Agents: run, approve, apply</li>
        <li>• Rate limits: 120 requests/min per API key</li>
        <li>• Error format: {'{ error: string }'}</li>
      </ul>
    </div>
  )
}
