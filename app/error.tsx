"use client"

export default function GlobalError({ error }: { error: Error }) {
  console.error(error)

  return (
    <div className="flex h-screen items-center justify-center bg-[#0A0A0A] text-white">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-lg font-semibold text-red-400">Something went wrong</h1>
        <p className="mt-2 text-sm text-white/60">{error.message}</p>
      </div>
    </div>
  )
}
