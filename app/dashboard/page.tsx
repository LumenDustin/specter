import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch available cases
  const { data: cases } = await supabase
    .from('cases')
    .select('id, slug, title, case_number, classification, difficulty, is_free, estimated_time_minutes')
    .eq('is_published', true)
    .order('case_number', { ascending: true })

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name')
    .eq('id', user.id)
    .single()

  // Get user's progress on all cases
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('case_id, notes, completed_at')
    .eq('user_id', user.id)

  // Calculate stats
  let completedCases = 0
  let trueSolutions = 0
  const progressMap = new Map<string, { bestResult: string; completed: boolean }>()

  if (userProgress) {
    for (const progress of userProgress) {
      try {
        const notes = progress.notes ? JSON.parse(progress.notes) : null
        const bestResult = notes?.bestResult || 'none'
        const completed = bestResult === 'surface' || bestResult === 'true'

        progressMap.set(progress.case_id, { bestResult, completed })

        if (completed) completedCases++
        if (bestResult === 'true') trueSolutions++
      } catch {
        // Skip invalid JSON
      }
    }
  }

  // Calculate clearance level based on true solutions found
  const clearanceLevel = trueSolutions >= 5 ? 3 : trueSolutions >= 2 ? 2 : 1

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold font-mono text-red-500">SPECTER</h1>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-zinc-100 font-medium">
              Dashboard
            </Link>
            <Link href="/cases" className="text-zinc-400 hover:text-zinc-100 transition">
              Case Files
            </Link>
            <Link href="/profile" className="text-zinc-400 hover:text-zinc-100 transition">
              Profile
            </Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-zinc-400 hover:text-zinc-100 transition">
                Sign Out
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-mono mb-2">
            Welcome, {profile?.display_name || profile?.username || 'Investigator'}
          </h2>
          <p className="text-zinc-400">Your mission: Investigate the unexplained.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-sm text-zinc-500 mb-1">Available Cases</p>
            <p className="text-3xl font-bold font-mono text-red-500">{cases?.length || 0}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-sm text-zinc-500 mb-1">Cases Completed</p>
            <p className="text-3xl font-bold font-mono text-green-500">{completedCases}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-sm text-zinc-500 mb-1">True Solutions</p>
            <p className="text-3xl font-bold font-mono text-purple-500">{trueSolutions}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-sm text-zinc-500 mb-1">Clearance Level</p>
            <p className="text-3xl font-bold font-mono text-amber-500">{clearanceLevel}</p>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Case Files</h3>
            <Link href="/cases" className="text-sm text-red-400 hover:text-red-300 transition">
              View All →
            </Link>
          </div>

          {cases && cases.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {cases.slice(0, 3).map((caseItem) => {
                const caseProgress = progressMap.get(caseItem.id)
                return (
                  <Link
                    key={caseItem.id}
                    href={`/cases/${caseItem.slug}`}
                    className="block px-6 py-4 hover:bg-zinc-800/50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-zinc-500">
                          #{caseItem.case_number}
                        </span>
                        <div>
                          <p className="font-medium">{caseItem.title}</p>
                          <p className="text-sm text-zinc-500 capitalize">
                            {caseItem.difficulty} • ~{caseItem.estimated_time_minutes} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {caseProgress?.bestResult === 'true' && (
                          <span className="text-xs bg-purple-900/30 text-purple-400 border border-purple-800 px-2 py-0.5 rounded">
                            ★ TRUE
                          </span>
                        )}
                        {caseProgress?.bestResult === 'surface' && (
                          <span className="text-xs bg-green-900/30 text-green-400 border border-green-800 px-2 py-0.5 rounded">
                            ✓ SOLVED
                          </span>
                        )}
                        {caseItem.is_free && !caseProgress?.completed && (
                          <span className="text-xs bg-green-900/30 text-green-400 border border-green-800 px-2 py-0.5 rounded">
                            FREE
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          caseItem.classification === 'AMBER'
                            ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
                            : caseItem.classification === 'RED'
                            ? 'bg-red-900/30 text-red-400 border border-red-800'
                            : 'bg-green-900/30 text-green-400 border border-green-800'
                        }`}>
                          {caseItem.classification}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-zinc-500">
              <p>No cases available yet. Check back soon.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/cases"
            className="block bg-red-900/20 border border-red-800 rounded-lg p-6 hover:bg-red-900/30 transition"
          >
            <h3 className="text-lg font-semibold text-red-400 mb-2">Browse Case Files</h3>
            <p className="text-sm text-zinc-400">
              Review all available investigations and select your next case.
            </p>
          </Link>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 opacity-50">
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">Training Center</h3>
            <p className="text-sm text-zinc-500">
              Coming soon: Learn investigation techniques.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
