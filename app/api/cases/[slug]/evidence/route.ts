import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/cases/[slug]/evidence - Get all evidence for a case
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  // First get the case ID from the slug
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (caseError) {
    if (caseError.code === 'PGRST116') {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }
    return NextResponse.json({ error: caseError.message }, { status: 500 })
  }

  // Get all evidence for this case
  const { data: evidence, error: evidenceError } = await supabase
    .from('evidence')
    .select('*')
    .eq('case_id', caseData.id)
    .order('sort_order', { ascending: true })

  if (evidenceError) {
    return NextResponse.json({ error: evidenceError.message }, { status: 500 })
  }

  return NextResponse.json({ evidence })
}
