import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Get the origin from the request headers
  const headersList = await headers()
  const origin = headersList.get('origin') || 'http://localhost:3000'

  return NextResponse.redirect(new URL('/login', origin))
}
