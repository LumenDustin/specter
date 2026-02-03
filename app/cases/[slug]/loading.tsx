export default function CaseLoading() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header Skeleton */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse" />
            <span className="text-zinc-700">|</span>
            <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Case Info Skeleton */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="h-7 w-3/4 bg-zinc-800 rounded animate-pulse mb-4" />
              <div className="flex items-center gap-4 mb-4">
                <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse" />
            </div>

            {/* Progress Skeleton */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse mb-3" />
              <div className="h-2 w-full bg-zinc-800 rounded-full animate-pulse" />
            </div>

            {/* Evidence List Skeleton */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="px-6 py-4 border-b border-zinc-800">
                <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse mb-2" />
                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="divide-y divide-zinc-800">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-8 bg-zinc-800 rounded animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse mb-1" />
                        <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Briefing Skeleton */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }} />
                ))}
              </div>
            </div>

            {/* Evidence Skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
                  <div>
                    <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
                    <div className="h-5 w-48 bg-zinc-800 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="p-6">
                  <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: `${Math.random() * 30 + 70}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
