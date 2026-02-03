// Complete seed script for Case #0001 STATIC
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedComplete() {
  // First, update the existing case to be free and published
  console.log('Updating case to be free and published...')

  const { data: caseData, error: updateError } = await supabase
    .from('cases')
    .update({
      is_free: true,
      is_published: true,
      briefing: `CLASSIFICATION: LEVEL 2 - RESIDENTIAL ANOMALY

CASE BRIEFING: STATIC

On September 15, 2024, the Hartwell family contacted local authorities regarding unexplained phenomena in their residence at 1847 Blackwood Lane, Cedar Falls. Initial police reports were dismissed as "domestic disturbance with no evidence of criminal activity."

The family reports:
• Television and radio interference occurring at precisely 3:17 AM nightly
• Temperature drops of 15-20 degrees in the upstairs hallway
• Their 7-year-old daughter claims to communicate with "the lady in the wall"
• Multiple electronic devices malfunctioning simultaneously

Previous occupants of the residence could not be located for interview. Property records show the house was vacant for 11 years before the Hartwells' purchase.

Your task: Review all evidence, identify the nature of the anomaly, and determine the source of the disturbance.

REMINDER: All findings are classified. Do not discuss case details outside of official channels.`
    })
    .eq('slug', 'static')
    .select()
    .single()

  if (updateError) {
    console.error('Error updating case:', updateError.message)
    return
  }

  console.log('Case updated:', caseData.id)

  // Check if evidence already exists
  const { data: existingEvidence } = await supabase
    .from('evidence')
    .select('id')
    .eq('case_id', caseData.id)

  if (existingEvidence && existingEvidence.length > 0) {
    console.log('Evidence already exists, skipping...')
    return
  }

  // Insert evidence
  console.log('Adding evidence items...')

  const evidenceItems = [
    {
      case_id: caseData.id,
      evidence_number: 'EV-001',
      title: 'Initial Police Report',
      evidence_type: 'document',
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

[Handwritten note at bottom]: Third call this month. Something's not right here.`,
      is_locked: false
    },
    {
      case_id: caseData.id,
      evidence_number: 'EV-002',
      title: 'Property Records',
      evidence_type: 'document',
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
• 2012-08: [RECORD SEALED BY COURT ORDER]`,
      is_locked: false
    },
    {
      case_id: caseData.id,
      evidence_number: 'EV-003',
      title: 'Interview: Emma Hartwell (Age 7)',
      evidence_type: 'transcript',
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

AGENT NOTES: Child shows no signs of distress during interview. Appeared matter-of-fact about experiences. No leading questions used. Recommend thermal imaging of upstairs hallway.`,
      is_locked: false
    },
    {
      case_id: caseData.id,
      evidence_number: 'EV-004',
      title: 'Thermal Imaging Results',
      evidence_type: 'report',
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

CONCLUSION: Thermal anomaly consistent with ███████ phenomenon. Recommend immediate ███████████.`,
      is_locked: true
    },
    {
      case_id: caseData.id,
      evidence_number: 'EV-005',
      title: 'Missing Person Report (2013)',
      evidence_type: 'document',
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

[Handwritten note]: Something wrong here. Husband's story doesn't add up. Renovation was never finished - why?`,
      is_locked: false
    }
  ]

  const { data: evidenceData, error: evidenceError } = await supabase
    .from('evidence')
    .insert(evidenceItems)
    .select()

  if (evidenceError) {
    console.error('Error inserting evidence:', evidenceError.message)
    return
  }

  console.log(`Added ${evidenceData.length} evidence items`)
  console.log('Done! Case #0001 STATIC is complete and published.')
}

seedComplete()
