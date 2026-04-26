'use client'

type Props = {
  onClick: () => void
}

export default function ComponentCommentButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-[#C9A24A]/40 bg-[#C9A24A]/10 px-2 py-1 text-[10px] uppercase tracking-wide text-[#C9A24A] hover:bg-[#C9A24A]/20"
    >
      Comment
    </button>
  )
}
