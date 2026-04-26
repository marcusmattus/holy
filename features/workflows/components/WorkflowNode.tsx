export function WorkflowNode({
  label,
  requiresApproval,
}: {
  label: string
  requiresApproval?: boolean
}) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/5 p-3 text-sm">
      <p>{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {requiresApproval ? 'Requires approval' : 'Auto-runnable'}
      </p>
    </div>
  )
}
