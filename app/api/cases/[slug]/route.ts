import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/cases/[slug] - Get a single case by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: caseData, error } = await supabase
    .from('cases')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Don't expose solutions unless explicitly requested
  const { surface_solution, true_solution, ...safeCase } = caseData

  return NextResponse.json({ case: safeCase })
}
