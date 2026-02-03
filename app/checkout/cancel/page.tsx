import Link from 'next/link'

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ case?: string }>
}) {
  const { case: caseSlug } = await searchParams

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-600">
          <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2">Purchase Cancelled</h1>
        <p className="text-zinc-400 mb-8">
          Your purchase was cancelled. No charges have been made to your account.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <p className="text-sm text-zinc-400">
            Changed your mind? You can always come back later to unlock premium case files.
          </p>
        </div>

        <div className="space-y-3">
          {caseSlug ? (
            <Link
              href={`/cases/${caseSlug}`}
              className="block w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
            >
              Return to Case
            </Link>
          ) : (
            <Link
              href="/cases"
              className="block w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
            >
              Browse Cases
            </Link>
          )}

          <Link
            href="/cases"
            className="block w-full py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-medium rounded-lg transition"
          >
            Try Our Free Case
          </Link>
        </div>

        <p className="text-xs text-zinc-600 mt-8">
          Need help? Contact support@specter.dev
        </p>
      </div>
    </div>
  )
}
