import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="text-8xl font-bold font-mono text-red-500/20 mb-4">404</div>

        <h1 className="text-2xl font-bold font-mono text-zinc-200 mb-2">
          CASE FILE NOT FOUND
        </h1>
        <p className="text-zinc-500 mb-8">
          The requested file does not exist or has been classified beyond your clearance level.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cases"
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition"
          >
            Browse Case Files
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium rounded transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
