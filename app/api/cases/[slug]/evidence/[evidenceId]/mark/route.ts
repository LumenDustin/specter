import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/cases/[slug]/evidence/[evidenceId]/mark - Mark evidence as reviewed
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string; evidenceId: string }> }
) {
  const { slug, evidenceId } = await params
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get the case
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (caseError || !caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  // Get request body
  const body = await request.json()
  const { reviewed, note } = body

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
    evidenceNotes?: Record<string, { reviewed: boolean; note: string; reviewedAt: string }>
  } = {
    submissions: [],
    bestResult: 'none',
    totalAttempts: 0,
    evidenceNotes: {}
  }

  if (existingProgress?.notes) {
    try {
      progressNotes = JSON.parse(existingProgress.notes)
      if (!progressNotes.evidenceNotes) {
        progressNotes.evidenceNotes = {}
      }
    } catch {
      // Keep defaults
    }
  }

  // Update evidence note
  progressNotes.evidenceNotes![evidenceId] = {
    reviewed: reviewed ?? true,
    note: note ?? '',
    reviewedAt: new Date().toISOString()
  }

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

  return NextResponse.json({
    success: true,
    evidenceId,
    reviewed: progressNotes.evidenceNotes![evidenceId].reviewed,
    note: progressNotes.evidenceNotes![evidenceId].note
  })
}
