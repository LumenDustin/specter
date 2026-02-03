import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's purchases
  const { data: purchases } = await supabase
    .from('purchases')
    .select(`
      id,
      amount,
      currency,
      created_at,
      cases (
        title,
        slug,
        case_number
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get user's progress stats
  const { data: progress } = await supabase
    .from('user_progress')
    .select('notes, completed_at')
    .eq('user_id', user.id)

  // Calculate stats
  let casesCompleted = 0
  let trueSolutions = 0

  if (progress) {
    for (const p of progress) {
      try {
        const notes = p.notes ? JSON.parse(p.notes) : null
        if (notes?.bestResult === 'true' || notes?.bestResult === 'surface') {
          casesCompleted++
        }
        if (notes?.bestResult === 'true') {
          trueSolutions++
        }
      } catch {
        // Skip invalid
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold font-mono text-red-500 hover:text-red-400 transition">
            SPECTER
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-100 transition">
              Dashboard
            </Link>
            <Link href="/cases" className="text-zinc-400 hover:text-zinc-100 transition">
              Case Files
            </Link>
            <span className="text-zinc-100 font-medium">Profile</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold font-mono mb-8">INVESTIGATOR PROFILE</h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Info */}
          <div className="space-y-6">
            <ProfileForm
              userId={user.id}
              email={user.email || ''}
              initialDisplayName={profile?.display_name || ''}
            />
          </div>

          {/* Stats & Activity */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Investigation Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold font-mono text-green-500">{casesCompleted}</p>
                  <p className="text-xs text-zinc-500 mt-1">Cases Solved</p>
                </div>
                <div className="bg-zinc-950 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold font-mono text-purple-500">{trueSolutions}</p>
                  <p className="text-xs text-zinc-500 mt-1">True Solutions</p>
                </div>
              </div>
            </div>

            {/* Purchases */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold">Purchase History</h2>
              </div>
              {purchases && purchases.length > 0 ? (
                <div className="divide-y divide-zinc-800">
                  {purchases.map((purchase) => {
                    // Handle both array and single object cases from Supabase join
                    const caseData = Array.isArray(purchase.cases)
                      ? purchase.cases[0]
                      : purchase.cases
                    return (
                      <div key={purchase.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {caseData?.title || 'Unknown Case'}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {new Date(purchase.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-green-400">
                              ${((purchase.amount || 0) / 100).toFixed(2)}
                            </p>
                            {caseData && (
                              <Link
                                href={`/cases/${caseData.slug}`}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                View Case →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-zinc-500">
                  <p>No purchases yet.</p>
                  <Link href="/cases" className="text-red-400 hover:text-red-300 text-sm">
                    Browse premium cases →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Email</p>
              <p className="font-mono">{user.email}</p>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 text-sm border border-zinc-700 hover:border-red-700 hover:text-red-400 rounded transition"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
