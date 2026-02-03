'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold font-mono text-red-500 mb-2">SYSTEM ERROR</h1>
        <p className="text-zinc-400 mb-6">
          An unexpected error occurred. Our team has been notified.
        </p>

        {error.digest && (
          <p className="text-xs text-zinc-600 font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition"
          >
            Try Again
          </button>
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
