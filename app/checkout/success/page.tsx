import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; case?: string }>
}) {
  const { session_id, case: caseSlug } = await searchParams
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch case info if provided
  let caseData = null
  if (caseSlug) {
    const { data } = await supabase
      .from('cases')
      .select('title, slug, case_number')
      .eq('slug', caseSlug)
      .single()
    caseData = data
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-600">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2">Purchase Complete!</h1>
        <p className="text-zinc-400 mb-8">
          Your transaction was successful. You now have full access to the case file.
        </p>

        {caseData && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
            <p className="text-xs font-mono text-zinc-500 mb-1">CASE #{caseData.case_number}</p>
            <p className="text-xl font-bold">{caseData.title}</p>
          </div>
        )}

        <div className="space-y-3">
          {caseData ? (
            <Link
              href={`/cases/${caseData.slug}`}
              className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
            >
              Start Investigation
            </Link>
          ) : (
            <Link
              href="/cases"
              className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
            >
              View All Cases
            </Link>
          )}

          <Link
            href="/profile"
            className="block w-full py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-medium rounded-lg transition"
          >
            View Purchase History
          </Link>
        </div>

        {session_id && (
          <p className="text-xs text-zinc-600 mt-8 font-mono">
            Transaction ID: {session_id.slice(0, 20)}...
          </p>
        )}
      </div>
    </div>
  )
}
