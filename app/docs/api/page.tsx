import Link from 'next/link'

export const metadata = { title: 'API Docs — Holy' }

export default function ApiDocsPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-semibold">API Documentation</h1>
      <p className="text-sm text-muted-foreground">
        Includes marketplace, workflows, enterprise identity, analytics cron, and rate limits.
      </p>
      <Link href="/docs/agents" className="text-sm text-[#C9A24A] underline">
        Agent docs
      </Link>
    </main>
  )
}
