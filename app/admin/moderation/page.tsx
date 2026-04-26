import { ModerationQueue } from '@/features/admin/components/ModerationQueue'

export default function ModerationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Marketplace Moderation</h1>
      <p className="text-sm text-muted-foreground">
        Review reports and enforce marketplace quality controls.
      </p>
      <ModerationQueue />
    </div>
  )
}
