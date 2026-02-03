export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="h-7 w-24 bg-zinc-800 rounded animate-pulse" />
          <nav className="flex items-center gap-6">
            <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" />
            <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" />
            <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-5 w-48 bg-zinc-800 rounded animate-pulse" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="h-8 w-12 bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Cases Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
            <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="divide-y divide-zinc-800">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse" />
                    <div>
                      <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse mb-1" />
                      <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-12 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="h-6 w-40 bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
