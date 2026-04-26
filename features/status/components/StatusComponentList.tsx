interface StatusComponent {
  id: string
  name: string
  slug: string
  status: string
  description?: string
}

export function StatusComponentList({ components }: { components: StatusComponent[] }) {
  return (
    <div className="space-y-3">
      {components.map((component) => (
        <div key={component.id} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-sm text-zinc-400">{component.name}</p>
          <p className="text-[#C9A24A]">{component.status}</p>
          {component.description ? <p className="mt-1 text-xs text-zinc-500">{component.description}</p> : null}
        </div>
      ))}
    </div>
  )
}
