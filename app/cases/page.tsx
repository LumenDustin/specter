import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CasesPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch all published cases
  const { data: cases, error } = await supabase
    .from('cases')
    .select('id, slug, title, case_number, classification, difficulty, briefing, is_free, estimated_time_minutes')
    .eq('is_published', true)
    .order('case_number', { ascending: true })

  if (error) {
    console.error('Error fetching cases:', error)
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold font-mono text-red-500 hover:text-red-400 transition">
            SPECTER
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-100 transition">
              Dashboard
            </Link>
            <Link href="/cases" className="text-zinc-100 font-medium">
              Case Files
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-mono mb-2">CASE FILES</h1>
          <p className="text-zinc-400">Select a case to begin your investigation</p>
        </div>

        {/* Case Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases && cases.length > 0 ? (
            cases.map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.slug}`}
                className="group block bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition"
              >
                {/* Case Header */}
                <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-zinc-500">
                      CASE #{caseItem.case_number}
                    </span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      caseItem.classification === 'AMBER'
                        ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
                        : caseItem.classification === 'RED'
                        ? 'bg-red-900/30 text-red-400 border border-red-800'
                        : 'bg-green-900/30 text-green-400 border border-green-800'
                    }`}>
                      {caseItem.classification}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition">
                    {caseItem.title}
                  </h2>
                </div>

                {/* Case Body */}
                <div className="px-5 py-4">
                  <p className="text-sm text-zinc-400 line-clamp-3 mb-4">
                    {caseItem.briefing?.substring(0, 150)}...
                  </p>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ~{caseItem.estimated_time_minutes} min
                    </span>
                    <span className="capitalize">{caseItem.difficulty}</span>
                    {caseItem.is_free && (
                      <span className="text-green-400 font-medium">FREE</span>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="px-5 py-3 bg-zinc-800/50 text-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-sm text-zinc-300">Open Case File →</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-zinc-500">
              <p>No cases available yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
