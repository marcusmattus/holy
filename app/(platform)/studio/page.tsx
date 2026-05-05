export default function StudioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Holy Studio</h1>
      <p className="text-sm text-white/60">Generate MVPs from prompts and iterate with AI.</p>

      <textarea
        className="w-full rounded-md border border-white/10 bg-black p-3"
        placeholder="Describe your app idea..."
      />

      <button className="rounded-md bg-[#C9A24A] px-4 py-2 text-black">
        Generate App
      </button>
    </div>
  )
}
