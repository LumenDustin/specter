// Minimal seed script - try different column combinations
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function tryInsert() {
  // Try with minimal fields first
  console.log('Attempting minimal insert...')

  const { data, error } = await supabase
    .from('cases')
    .insert({
      case_number: '0001',
      title: 'The Hartwell Incident',
      slug: 'static',
      briefing: 'A family reports strange occurrences in their newly purchased home. Investigation reveals a darker history.',
      surface_solution: 'The phenomena are caused by the residual energy of Margaret Holloway, a woman who died in the house in 2012.',
      true_solution: 'Margaret Holloway did not die by accident. Her husband Robert deliberately sealed her in during the renovation and disappeared. Her remains are hidden behind the upstairs hallway drywall.'
    })
    .select()

  if (error) {
    console.log('Minimal insert error:', error.message)
    console.log('Details:', error.details)
    console.log('Hint:', error.hint)
  } else {
    console.log('Success! Data:', data)
  }
}

tryInsert()
