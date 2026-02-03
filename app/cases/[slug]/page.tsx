import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import TheorySubmission from './TheorySubmission'
import EvidenceCard from './EvidenceCard'
import HintsPanel from './HintsPanel'
import PurchaseButton from './PurchaseButton'
import { getCasePrice } from '@/lib/stripe'

interface Evidence {
  id: string
  title: string
  type: string
  content: string
  image_url: string | null
  sort_order: number
}

interface EvidenceNote {
  reviewed: boolean
  note: string
  reviewedAt: string
}

export default async function CaseViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch case data
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('id, slug, title, case_number, classification, difficulty, briefing, is_free, estimated_time_minutes')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (caseError || !caseData) {
    notFound()
  }

  // Check if user has purchased this case (if not free)
  let hasAccess = caseData.is_free
  if (!hasAccess) {
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('case_id', caseData.id)
      .single()

    hasAccess = !!purchase
  }

  // Fetch evidence only if user has access
  let evidence: Evidence[] | null = null
  let evidenceNotes: Record<string, EvidenceNote> = {}
  let reviewedCount = 0

  if (hasAccess) {
    const { data: evidenceData } = await supabase
      .from('evidence')
      .select('*')
      .eq('case_id', caseData.id)
      .order('sort_order', { ascending: true })

    evidence = evidenceData

    // Fetch user progress for this case
    const { data: progress } = await supabase
      .from('user_progress')
      .select('notes')
      .eq('user_id', user.id)
      .eq('case_id', caseData.id)
      .single()

    // Parse evidence notes from progress
    if (progress?.notes) {
      try {
        const parsed = JSON.parse(progress.notes)
        evidenceNotes = parsed.evidenceNotes || {}
      } catch {
        // Keep empty
      }
    }

    reviewedCount = Object.values(evidenceNotes).filter(n => n.reviewed).length
  }

  const totalEvidence = evidence?.length || 0
  const casePrice = getCasePrice(slug)

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/cases" className="text-zinc-400 hover:text-zinc-100 transition">
              ← Back to Cases
            </Link>
            <span className="text-zinc-700">|</span>
            <span className="text-xs font-mono text-zinc-500">CASE #{caseData.case_number}</span>
          </div>
          <span className={`text-xs font-mono px-2 py-0.5 rounded ${
            caseData.classification === 'AMBER'
              ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
              : caseData.classification === 'RED'
              ? 'bg-red-900/30 text-red-400 border border-red-800'
              : 'bg-green-900/30 text-green-400 border border-green-800'
          }`}>
            {caseData.classification}
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Case Info & Evidence List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Case Info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-2">{caseData.title}</h1>
              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
                <span className="capitalize">{caseData.difficulty}</span>
                <span>•</span>
                <span>~{caseData.estimated_time_minutes} min</span>
              </div>
              {caseData.is_free ? (
                <span className="inline-block text-xs bg-green-900/30 text-green-400 border border-green-800 px-2 py-1 rounded">
                  FREE CASE
                </span>
              ) : hasAccess ? (
                <span className="inline-block text-xs bg-purple-900/30 text-purple-400 border border-purple-800 px-2 py-1 rounded">
                  PURCHASED
                </span>
              ) : (
                <span className="inline-block text-xs bg-red-900/30 text-red-400 border border-red-800 px-2 py-1 rounded">
                  PREMIUM CASE
                </span>
              )}
            </div>

            {hasAccess && (
              <>
                {/* Evidence Progress */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-zinc-400 mb-3">Evidence Review Progress</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${totalEvidence > 0 ? (reviewedCount / totalEvidence) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-zinc-400">
                      {reviewedCount}/{totalEvidence}
                    </span>
                  </div>
                </div>

                {/* Evidence List */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="px-6 py-4 border-b border-zinc-800">
                    <h2 className="text-lg font-semibold">Evidence Items</h2>
                    <p className="text-sm text-zinc-500">{evidence?.length || 0} items collected</p>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {evidence && evidence.map((item: Evidence, index: number) => {
                      const isReviewed = evidenceNotes[item.id]?.reviewed
                      return (
                        <a
                          key={item.id}
                          href={`#evidence-${index + 1}`}
                          className="block px-6 py-3 hover:bg-zinc-800/50 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-mono w-8 ${isReviewed ? 'text-green-400' : 'text-zinc-500'}`}>
                              {isReviewed ? '✓' : `#${String(index + 1).padStart(2, '0')}`}
                            </span>
                            <div>
                              <p className={`text-sm ${isReviewed ? 'text-zinc-400' : 'text-zinc-200'}`}>
                                {item.title}
                              </p>
                              <p className="text-xs text-zinc-500 capitalize">{item.type}</p>
                            </div>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Content - Briefing & Evidence */}
          <div className="lg:col-span-2 space-y-6">
            {/* Briefing */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-lg font-semibold font-mono">CASE BRIEFING</h2>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-300 bg-zinc-950 p-4 rounded border border-zinc-800">
                  {caseData.briefing}
                </pre>
              </div>
            </div>

            {/* Show purchase button or case content */}
            {!hasAccess ? (
              <PurchaseButton
                caseSlug={caseData.slug}
                caseTitle={caseData.title}
                price={casePrice}
              />
            ) : (
              <>
                {/* Evidence Items */}
                {evidence && evidence.map((item: Evidence, index: number) => (
                  <EvidenceCard
                    key={item.id}
                    evidence={item}
                    index={index}
                    caseSlug={caseData.slug}
                    initialReviewed={evidenceNotes[item.id]?.reviewed || false}
                    initialNote={evidenceNotes[item.id]?.note || ''}
                  />
                ))}

                {/* Hints Panel */}
                <HintsPanel caseSlug={caseData.slug} />

                {/* Theory Submission */}
                <TheorySubmission caseSlug={caseData.slug} caseTitle={caseData.title} caseNumber={caseData.case_number} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
