import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/cases - List all published cases
export async function GET() {
  const supabase = await createClient()

  const { data: cases, error } = await supabase
    .from('cases')
    .select('id, slug, title, case_number, classification, difficulty, briefing, is_free, estimated_time_minutes, created_at')
    .eq('is_published', true)
    .order('case_number', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ cases })
}
