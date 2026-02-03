import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Hints are stored per case - in production these would be in the database
const CASE_HINTS: Record<string, string[]> = {
  static: [
    "Pay close attention to the property records. Why was the house vacant for 11 years?",
    "The thermal imaging shows cold spots in the upstairs hallway. What could cause a localized temperature anomaly?",
    "Margaret Holloway's disappearance and the 'renovation' mentioned by her husband may be connected.",
    "Sometimes what appears to be a haunting is actually evidence of something more sinister. Consider who benefits from the 'ghost' explanation.",
    "The true solution lies behind the walls. Literally."
  ],
  echoes: [
    "Marcus Chen's birth certificate was 'destroyed in a fire' - but Blackwood Sanitarium also had a convenient fire. Coincidence?",
    "The coordinates spoken in the recording point to a specific location on the sanitarium grounds. What was there?",
    "Chen was born on the same day his mother died. At a facility that wasn't a maternity ward.",
    "The CIA memo mentions 'offspring may inherit implanted memories.' Consider the implications.",
    "The voice at 39:15 matches Chen's vocal signature but speaks of 'Mother.' Who is really speaking?"
  ],
  threshold: [
    "The disappearances occur every 50 years - but the gap is shortening. 100 years, then 50. What's next?",
    "Map the victims' homes. The pattern isn't random - it's geometric.",
    "The Threshold Society weren't occultists. Read their charter carefully - they were trying to PREVENT something.",
    "Elizabeth Ward's journal mentions seeing people 'pressing against something invisible.' The 1923 victims may not be dead.",
    "The barrier is weakening. The 13 who disappear don't die - they become part of the seal. But is it enough?"
  ]
}

// GET /api/cases/[slug]/hints - Get hints for a case
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get case
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (caseError || !caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  // Get user progress to see how many hints they've revealed
  const { data: progress } = await supabase
    .from('user_progress')
    .select('notes')
    .eq('user_id', user.id)
    .eq('case_id', caseData.id)
    .single()

  let hintsRevealed = 0
  if (progress?.notes) {
    try {
      const parsed = JSON.parse(progress.notes)
      hintsRevealed = parsed.hintsRevealed || 0
    } catch {
      // Keep 0
    }
  }

  const allHints = CASE_HINTS[slug] || []
  const totalHints = allHints.length
  const revealedHints = allHints.slice(0, hintsRevealed)

  return NextResponse.json({
    hintsRevealed,
    totalHints,
    hints: revealedHints,
    hasMoreHints: hintsRevealed < totalHints
  })
}

// POST /api/cases/[slug]/hints - Reveal the next hint
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get case
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (caseError || !caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  const allHints = CASE_HINTS[slug] || []
  const totalHints = allHints.length

  // Get or create user progress
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('id, notes')
    .eq('user_id', user.id)
    .eq('case_id', caseData.id)
    .single()

  // Parse existing notes
  let progressNotes: {
    submissions?: unknown[]
    bestResult?: string
    totalAttempts?: number
    evidenceNotes?: Record<string, unknown>
    hintsRevealed?: number
  } = {
    submissions: [],
    bestResult: 'none',
    totalAttempts: 0,
    evidenceNotes: {},
    hintsRevealed: 0
  }

  if (existingProgress?.notes) {
    try {
      progressNotes = JSON.parse(existingProgress.notes)
      if (progressNotes.hintsRevealed === undefined) {
        progressNotes.hintsRevealed = 0
      }
    } catch {
      // Keep defaults
    }
  }

  // Check if there are more hints to reveal
  if (progressNotes.hintsRevealed! >= totalHints) {
    return NextResponse.json({
      error: 'No more hints available',
      hintsRevealed: progressNotes.hintsRevealed,
      totalHints
    }, { status: 400 })
  }

  // Reveal next hint
  progressNotes.hintsRevealed!++

  // Upsert progress
  const progressData = {
    user_id: user.id,
    case_id: caseData.id,
    notes: JSON.stringify(progressNotes),
    updated_at: new Date().toISOString()
  }

  if (existingProgress) {
    await supabase
      .from('user_progress')
      .update(progressData)
      .eq('id', existingProgress.id)
  } else {
    await supabase
      .from('user_progress')
      .insert({
        ...progressData,
        started_at: new Date().toISOString()
      })
  }

  const revealedHints = allHints.slice(0, progressNotes.hintsRevealed)
  const newHint = allHints[progressNotes.hintsRevealed! - 1]

  return NextResponse.json({
    success: true,
    hintsRevealed: progressNotes.hintsRevealed,
    totalHints,
    hints: revealedHints,
    newHint,
    hasMoreHints: progressNotes.hintsRevealed! < totalHints
  })
}
