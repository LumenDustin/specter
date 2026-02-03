import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface TheorySubmission {
  theory: string
  submittedAt: string
  result: 'surface' | 'true' | 'incorrect'
  attempts: number
}

interface ProgressNotes {
  submissions: TheorySubmission[]
  bestResult: 'none' | 'surface' | 'true'
  totalAttempts: number
}

// Simple similarity check - in production you'd use NLP/AI
function checkTheorySimilarity(userTheory: string, solution: string): number {
  const userWords = userTheory.toLowerCase().split(/\s+/)
  const solutionWords = solution.toLowerCase().split(/\s+/)

  // Key phrases to look for
  const keyPhrases = solutionWords.filter(word => word.length > 4)
  const matchedPhrases = keyPhrases.filter(phrase =>
    userTheory.toLowerCase().includes(phrase)
  )

  return matchedPhrases.length / Math.max(keyPhrases.length, 1)
}

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

  // Get the theory from request body
  const body = await request.json()
  const { theory } = body

  if (!theory || theory.trim().length < 20) {
    return NextResponse.json({
      error: 'Theory must be at least 20 characters'
    }, { status: 400 })
  }

  // Fetch the case with solutions
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('id, title, surface_solution, true_solution')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (caseError || !caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  // Check similarity against both solutions
  const surfaceScore = checkTheorySimilarity(theory, caseData.surface_solution || '')
  const trueScore = checkTheorySimilarity(theory, caseData.true_solution || '')

  // Determine result based on scores
  let result: 'surface' | 'true' | 'incorrect'
  let feedback: string
  let revealedSolution: string | null = null

  if (trueScore >= 0.4) {
    result = 'true'
    feedback = 'EXCEPTIONAL WORK, INVESTIGATOR. You have uncovered the TRUE nature of this case. Your clearance level has been noted.'
    revealedSolution = caseData.true_solution
  } else if (surfaceScore >= 0.3) {
    result = 'surface'
    feedback = 'CASE CLOSED - Surface level explanation accepted. However, our analysts believe there may be more to this case. Consider reviewing the evidence again.'
    revealedSolution = caseData.surface_solution
  } else {
    result = 'incorrect'
    feedback = 'Your theory does not align with the evidence. Review the case files and try again.'
  }

  // Get or create user progress
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('id, notes')
    .eq('user_id', user.id)
    .eq('case_id', caseData.id)
    .single()

  // Parse existing notes or create new
  let progressNotes: ProgressNotes = {
    submissions: [],
    bestResult: 'none',
    totalAttempts: 0
  }

  if (existingProgress?.notes) {
    try {
      progressNotes = JSON.parse(existingProgress.notes)
    } catch {
      // Keep default if parse fails
    }
  }

  // Add new submission
  progressNotes.submissions.push({
    theory: theory.substring(0, 500), // Limit stored theory length
    submittedAt: new Date().toISOString(),
    result,
    attempts: progressNotes.totalAttempts + 1
  })
  progressNotes.totalAttempts++

  // Update best result
  if (result === 'true') {
    progressNotes.bestResult = 'true'
  } else if (result === 'surface' && progressNotes.bestResult !== 'true') {
    progressNotes.bestResult = 'surface'
  }

  // Upsert progress
  const progressData = {
    user_id: user.id,
    case_id: caseData.id,
    notes: JSON.stringify(progressNotes),
    completed_at: result !== 'incorrect' ? new Date().toISOString() : null,
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
    result,
    feedback,
    revealedSolution,
    attempts: progressNotes.totalAttempts,
    bestResult: progressNotes.bestResult
  })
}
