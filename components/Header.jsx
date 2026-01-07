export default function Header() {
  return (
    <header className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-sm font-bold">
          PH
        </div>
        <div>
          <h1 className="text-lg font-semibold">PocketHistory</h1>
          <div className="text-xs text-white/60">
            Personal finance & habit dashboard
          </div>
        </div>
      </div>

      <div className="text-xs text-white/50 rounded-full border border-white/10 px-3 py-1">
        Track. Reflect. Grow.
      </div>
    </header>
  )
}
