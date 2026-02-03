// Check actual schema
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  // Query information_schema to get actual column names
  const { data, error } = await supabase
    .rpc('get_table_columns', { table_name: 'cases' })

  if (error) {
    // Try direct query
    const { data: data2, error: error2 } = await supabase
      .from('cases')
      .select()
      .limit(1)

    if (error2) {
      console.log('Error:', error2)
    } else {
      console.log('Cases table sample:', data2)
      if (data2 && data2.length > 0) {
        console.log('Columns:', Object.keys(data2[0]))
      }
    }
  } else {
    console.log('Columns:', data)
  }
}

checkSchema()
