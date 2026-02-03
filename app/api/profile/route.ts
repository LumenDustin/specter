import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { display_name } = body

  // Update profile - only display_name is editable
  const { error: updateError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      display_name: display_name || null,
      updated_at: new Date().toISOString(),
    })

  if (updateError) {
    console.error('Profile update error:', updateError)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
