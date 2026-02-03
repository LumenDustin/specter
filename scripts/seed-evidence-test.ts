// Test evidence insert
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testEvidence() {
  // Get the case ID
  const { data: caseData } = await supabase
    .from('cases')
    .select('id')
    .eq('slug', 'static')
    .single()

  if (!caseData) {
    console.log('Case not found')
    return
  }

  console.log('Case ID:', caseData.id)

  // Try minimal evidence insert
  const { data, error } = await supabase
    .from('evidence')
    .insert({
      case_id: caseData.id,
      title: 'Test Evidence',
      type: 'document',
      content: 'Test content here'
    })
    .select()

  if (error) {
    console.log('Error:', error.message)
    console.log('Details:', error.details)
  } else {
    console.log('Success:', data)
  }
}

testEvidence()
