// Final evidence seed script
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedEvidence() {
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

  // Delete existing evidence
  await supabase.from('evidence').delete().eq('case_id', caseData.id)

  // Insert all evidence items
  const evidenceItems = [
    {
      case_id: caseData.id,
      title: 'Initial Police Report',
      type: 'document',
      sort_order: 1,
      content: `CEDAR FALLS POLICE DEPARTMENT
INCIDENT REPORT #2024-09-4892

Date: September 15, 2024
Responding Officer: Deputy M. Chen
Location: 1847 Blackwood Lane

SUMMARY:
Responded to call regarding "strange noises and electrical problems." Upon arrival, met with homeowners James and Sarah Hartwell.

Mr. Hartwell reported that electronics in the home malfunction regularly, specifically at night. Mrs. Hartwell appeared distressed, mentioning their daughter has been "talking to someone who isn't there."

Inspected the premises. No signs of forced entry. No evidence of criminal activity. Electrical panel appears up to code.

Recommended homeowners contact an electrician.

DISPOSITION: Unfounded - No further action required.

[Handwritten note at bottom]: Third call this month. Something's not right here.`
    },
    {
      case_id: caseData.id,
      title: 'Property Records',
      type: 'document',
      sort_order: 2,
      content: `CEDAR FALLS COUNTY PROPERTY RECORDS
PARCEL: 1847 BLACKWOOD LANE

OWNERSHIP HISTORY:
• 2024-Present: James & Sarah Hartwell (Purchase price: $285,000)
• 2013-2024: VACANT (Bank-owned foreclosure)
• 2008-2013: Robert & Margaret Holloway
• 1995-2008: Theodore Ashworth Estate
• 1962-1995: Theodore & Edna Ashworth

NOTES:
• Property underwent significant renovation in 2012
• Foreclosure filed March 2013 after owner (R. Holloway) abandoned property
• No forwarding address on file for Holloway
• Multiple citations for property neglect during vacancy period

PERMITS FILED:
• 2012-04: Renovation permit - interior remodel, bathroom addition
• 2012-06: Permit CANCELLED - work incomplete
• 2012-08: [RECORD SEALED BY COURT ORDER]`
    },
    {
      case_id: caseData.id,
      title: 'Interview: Emma Hartwell (Age 7)',
      type: 'transcript',
      sort_order: 3,
      content: `SPECTER FIELD INTERVIEW
Subject: Emma Hartwell, Age 7
Interviewer: Agent Reyes
Date: September 22, 2024

[Recording begins]

REYES: Hi Emma. Can you tell me about your new house?

EMMA: It's big. I have my own room. But I don't like the hallway.

REYES: Why not?

EMMA: That's where the cold is. And the lady.

REYES: What lady?

EMMA: The lady in the wall. She's sad. She can't get out.

REYES: Can you tell me more about her?

EMMA: She has pretty hair. Brown like mommy's. She cries at night. That's when the TV goes fuzzy.

REYES: Does she talk to you?

EMMA: Not with words. She shows me pictures. In my head.

REYES: What kind of pictures?

EMMA: Dark ones. She's scared. There's a man. He put her there. She wants someone to find her.

REYES: Find her where?

EMMA: [Points upward] Behind the wall. Where the cold is.

[Recording ends]

AGENT NOTES: Child shows no signs of distress during interview. Appeared matter-of-fact about experiences. No leading questions used. Recommend thermal imaging of upstairs hallway.`
    },
    {
      case_id: caseData.id,
      title: 'Thermal Imaging Analysis',
      type: 'report',
      sort_order: 4,
      content: `SPECTER TECHNICAL ANALYSIS
THERMAL IMAGING SURVEY
Location: 1847 Blackwood Lane, Cedar Falls
Date: September 23, 2024

EQUIPMENT: FLIR T1020 Thermal Camera

FINDINGS:

Living Room: Normal thermal distribution
Kitchen: Normal thermal distribution
Basement: Normal thermal distribution
Master Bedroom: Normal thermal distribution
Emma's Bedroom: Normal thermal distribution

UPSTAIRS HALLWAY - ANOMALY DETECTED:
• Persistent cold spot measuring 12°F below ambient
• Location: Eastern wall, approximately 6 feet from floor
• Cold spot dimensions: Approximately 5'2" x 18"
• Pattern suggests humanoid shape
• Temperature remained constant over 4-hour observation period
• No draft source identified
• No plumbing or HVAC explanation

ADDITIONAL OBSERVATION:
At 3:17 AM, thermal camera recorded sudden 8-degree temperature drop across entire hallway lasting 47 seconds. During this event, all battery-powered equipment experienced momentary failure.

CONCLUSION: Thermal anomaly consistent with ███████████ phenomenon. Recommend immediate ██████████████████.`
    },
    {
      case_id: caseData.id,
      title: 'Missing Person Report (2013)',
      type: 'document',
      sort_order: 5,
      content: `CEDAR FALLS POLICE DEPARTMENT
MISSING PERSON REPORT

CASE #: 2013-MP-0892
DATE FILED: April 3, 2013
REPORTING PARTY: Susan Holloway (sister of missing person)

MISSING PERSON:
Name: Margaret Anne Holloway
DOB: March 15, 1978
Height: 5'2"
Weight: 125 lbs
Hair: Brown
Eyes: Green
Last Known Address: 1847 Blackwood Lane, Cedar Falls

CIRCUMSTANCES:
Reporting party states she has not heard from her sister since February 2013. Margaret's husband Robert claims she "left him" in late 2012 but cannot provide details.

Susan Holloway states this is out of character. Margaret would never leave without contacting family.

Robert Holloway was interviewed and stated Margaret left after an argument about the house renovation. He claims she took a suitcase and her car. Car was later found abandoned at a bus station in Millbrook (40 miles away).

INVESTIGATION STATUS:
• No credit card activity since February 2013
• No phone records since February 2013
• Husband passed polygraph (inconclusive)
• Insufficient evidence for further investigation

CASE STATUS: SUSPENDED - Pending new information

[Handwritten note]: Something wrong here. Husband's story doesn't add up. Renovation was never finished - why?`
    }
  ]

  const { data, error } = await supabase
    .from('evidence')
    .insert(evidenceItems)
    .select()

  if (error) {
    console.log('Error:', error.message)
    console.log('Details:', error.details)
  } else {
    console.log(`Success! Added ${data.length} evidence items.`)
  }
}

seedEvidence()
