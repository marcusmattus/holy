import type { HolyFileMap } from '../types'

export function FileExplorer({ files }: { files: HolyFileMap }) {
  const paths = Object.keys(files).sort()

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Project files</p>
      <ul className="mt-3 space-y-1">
        {paths.map((path) => (
          <li key={path} className="truncate rounded-lg px-2 py-1.5 text-xs text-white/60">
            {path}
          </li>
        ))}
      </ul>
    </div>
  )
}
