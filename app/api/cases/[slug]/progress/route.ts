import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

  // Get the case ID
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (caseError || !caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  // Get user progress
  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('case_id', caseData.id)
    .single()

  if (progressError && progressError.code !== 'PGRST116') {
    return NextResponse.json({ error: progressError.message }, { status: 500 })
  }

  // Parse notes if exists
  let parsedProgress = null
  if (progress?.notes) {
    try {
      const notes = JSON.parse(progress.notes)
      parsedProgress = {
        started_at: progress.started_at,
        completed_at: progress.completed_at,
        bestResult: notes.bestResult || 'none',
        totalAttempts: notes.totalAttempts || 0,
        submissions: notes.submissions || []
      }
    } catch {
      parsedProgress = {
        started_at: progress.started_at,
        completed_at: progress.completed_at,
        bestResult: 'none',
        totalAttempts: 0,
        submissions: []
      }
    }
  }

  return NextResponse.json({ progress: parsedProgress })
}
