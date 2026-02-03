export default function CasesLoading() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="h-7 w-24 bg-zinc-800 rounded animate-pulse" />
          <nav className="flex items-center gap-6">
            <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" />
            <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="h-8 w-40 bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-zinc-800 rounded animate-pulse" />
        </div>

        {/* Case Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="h-6 w-3/4 bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="px-5 py-4">
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
