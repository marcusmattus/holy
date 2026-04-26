export function SecuritySettingsPanel() {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Security Settings</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Configure 2FA policy, allowed domains, and API access controls.
      </p>
    </section>
  )
}
