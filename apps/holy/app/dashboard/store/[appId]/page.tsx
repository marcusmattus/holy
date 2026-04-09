import Link from 'next/link'

const STORE_APPS: Record<string, { name: string; description: string; author: string; price: number; rating: number; downloads: number; category: string }> = {
  '1': { name: 'Analytics Pro', description: 'Advanced analytics dashboard with real-time data, heatmaps, and conversion funnels.', author: 'DataTeam', price: 29, rating: 4.8, downloads: 2340, category: 'Analytics' },
  '2': { name: 'Commerce Kit', description: 'Full-featured e-commerce starter with cart, checkout, and inventory management.', author: 'ShopBuilders', price: 49, rating: 4.6, downloads: 1820, category: 'Commerce' },
  '3': { name: 'Auth Module', description: 'Plug-and-play authentication with social login, 2FA, and role management.', author: 'SecureDevs', price: 19, rating: 4.9, downloads: 4100, category: 'Auth' },
}

export default function AppDetailPage({ params }: { params: { appId: string } }) {
  const app = STORE_APPS[params.appId]
  if (!app) return <div>App not found</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/store" className="hover:text-foreground">Store</Link>
        <span>/</span>
        <span className="text-foreground">{app.name}</span>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{app.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">by {app.author} · {app.category}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${app.price}</p>
            <p className="text-xs text-muted-foreground">one-time</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{app.description}</p>
        <div className="flex gap-4 text-sm">
          <span>⭐ {app.rating}</span>
          <span>{app.downloads.toLocaleString()} installs</span>
        </div>
        <button className="w-full rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors">
          Install App — ${app.price}
        </button>
      </div>
    </div>
  )
}
