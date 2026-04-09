export const metadata = { title: 'Settings — Holy' }

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
      </div>
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {[
          { section: 'Profile', fields: [
            { label: 'Display name', value: 'holystic.builder' },
            { label: 'Email', value: 'builder@holysticlabs.com' },
          ]},
          { section: 'API Keys', fields: [
            { label: 'HolyOS API Key', value: 'holy_sk_••••••••••••••••' },
          ]},
        ].map(({ section, fields }) => (
          <div key={section} className="p-6 space-y-4">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{section}</h2>
            {fields.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
                  Edit
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
