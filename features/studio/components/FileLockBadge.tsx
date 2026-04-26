'use client'

export default function FileLockBadge({
  filePath,
  owner,
}: {
  filePath: string
  owner?: string
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-[#C9A24A]/40 bg-[#C9A24A]/10 px-2 py-1 text-[10px] uppercase tracking-wide text-[#C9A24A]">
      Locked: {filePath} {owner ? `· ${owner}` : ''}
    </span>
  )
}
