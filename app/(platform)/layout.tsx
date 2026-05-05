export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F8F2E5]">
      <aside className="w-64 border-r border-white/10 p-4">
        <nav className="space-y-3 text-sm">
          <a href="/studio">Studio</a>
          <a href="/projects">Projects</a>
          <a href="/store">Store</a>
          <a href="/insights">Insights</a>
          <a href="/admin">Admin</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
