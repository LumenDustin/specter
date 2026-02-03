import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedCase002() {
  console.log('Seeding Case #0002 - ECHOES...')

  // Insert the case
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .insert({
      slug: 'echoes',
      title: 'The Blackwood Recording',
      case_number: '0002',
      classification: 'RED',
      difficulty: 'senior',
      briefing: `CLASSIFICATION: LEVEL 3 - AUDIO ANOMALY

CASE BRIEFING: ECHOES

On March 3, 2024, amateur podcast host Marcus Chen submitted an audio file to local authorities claiming it contained "impossible sounds." The recording was made during a solo investigation of the abandoned Blackwood Sanitarium.

Chen entered the facility at 11:47 PM with standard recording equipment. His 47-minute recording contains the following anomalies:

• At 12:03 AM - A voice clearly states Chen's full name, though he never spoke it aloud
• At 12:17 AM - Sounds of multiple footsteps despite Chen being alone
• At 12:31 AM - A woman's voice repeating coordinates: "41.4032° N, 2.1743° W"
• At 12:44 AM - Chen's own voice is heard saying words he claims he never spoke

Chen has no memory of the final 8 minutes of his recording. Medical examination shows no signs of trauma or substance use.

The Blackwood Sanitarium operated from 1923-1967. Patient records were allegedly destroyed in a fire, though some staff members dispute this claim.

Your task: Analyze all evidence, determine the source of the audio anomalies, and explain what happened to Marcus Chen during the missing 8 minutes.

REMINDER: This case has been flagged for potential cognitohazard. Limit audio playback to 30-second intervals.`,
      surface_solution: 'The audio anomalies are the result of residual psychic imprints from former patients who died at Blackwood Sanitarium. Chen experienced a temporary possession episode.',
      true_solution: 'Marcus Chen discovered that Blackwood Sanitarium was used for illegal CIA experiments in the 1960s. The coordinates point to a mass grave. The "possession" was actually Chen uncovering suppressed memories implanted in him as a child - he was born at Blackwood in 1967, the son of a test subject. The voice saying his name was his own mother.',
      is_free: false,
      is_published: true,
      estimated_time_minutes: 45
    })
    .select()
    .single()

  if (caseError) {
    console.error('Error inserting case:', caseError)
    return
  }

  console.log('Case inserted:', caseData.id)

  // Insert evidence
  const evidence = [
    {
      case_id: caseData.id,
      title: 'Audio Recording - Full Transcript',
      type: 'document',
      sort_order: 1,
      content: `BLACKWOOD SANITARIUM AUDIO TRANSCRIPT
Recorded: March 3, 2024
Duration: 47:23
Transcribed by: SPECTER Audio Analysis Division

[00:00] CHEN: Testing, testing. Marcus Chen, solo investigation of Blackwood Sanitarium. Time is 11:47 PM.

[03:12] CHEN: Entering main hall. Place is... wow, completely trashed. Graffiti everywhere.

[08:45] CHEN: Found the old patient ward. Beds still here, rusted to hell.

[12:03] UNKNOWN VOICE (female, elderly): Marcus... David... Chen...
[Note: Chen's middle name is David. He did not state this on recording.]

[12:04] CHEN: What the— Hello? Is someone there?

[15:22] CHEN: I keep hearing footsteps behind me but there's nobody here. Getting creepy.

[17:33] [Sound of multiple footsteps, estimated 4-6 individuals]

[17:45] CHEN: Okay, I definitely heard that. Who's there?

[23:18] CHEN: Found what looks like an office. Filing cabinets are empty but...

[31:07] UNKNOWN VOICE (female, young): Forty-one point four zero three two north... two point one seven four three west...

[31:22] CHEN: Did you guys hear that? The coordinates?

[39:15] CHEN'S VOICE (but speaking simultaneously with Chen's actual voice): They buried us in the garden. Mother is still waiting.

[39:16] CHEN: I didn't say that. I didn't—

[39:23] [Recording becomes distorted]

[47:23] [Recording ends abruptly]

ANALYSIS NOTE: Voice pattern analysis confirms the voice at 39:15 matches Chen's vocal signature with 97.3% accuracy. Chen denies speaking these words.`
    },
    {
      case_id: caseData.id,
      title: 'Blackwood Sanitarium - Historical Records',
      type: 'document',
      sort_order: 2,
      content: `BLACKWOOD SANITARIUM
Historical Summary - Compiled from County Archives

ESTABLISHED: 1923
CLOSED: 1967
CAPACITY: 340 patients

NOTABLE HISTORY:
- Founded by Dr. Harold Blackwood as a "progressive treatment facility"
- Specialized in treating "hysteria" and "nervous disorders"
- 1934: Investigated for patient deaths, no charges filed
- 1952-1967: Received federal funding for "research purposes" (records sealed)
- 1967: Closed following fire in records building
- 1968: Dr. Blackwood died under mysterious circumstances

FIRE INCIDENT (1967):
Official cause: Electrical fault
Destroyed: All patient records from 1950-1967
Suspicious elements:
- Fire started at 3:17 AM
- Night security guard reported seeing "men in suits" leaving before fire
- No investigation conducted

STAFF TESTIMONY (1968 interview, unpublished):
Former nurse Edith Crane stated: "They told us the records burned. But I saw them loading boxes into trucks the week before. Government trucks."

CURRENT STATUS:
Property condemned. Multiple trespassing incidents reported. Local urban legend claims the facility is haunted.`
    },
    {
      case_id: caseData.id,
      title: 'Marcus Chen - Background Check',
      type: 'report',
      sort_order: 3,
      content: `SUBJECT BACKGROUND REPORT
Name: Marcus David Chen
DOB: December 14, 1967
Place of Birth: [RECORDS UNAVAILABLE - See Note]

FAMILY:
- Father: Unknown
- Mother: Sarah Chen (née Morrison) - Deceased 1967
- Adoptive Parents: Robert & Linda Chen (adopted Marcus in 1968)

EDUCATION:
- BA Communications, State University, 1989
- Currently operates podcast "Weird America"

MEDICAL HISTORY:
- Childhood amnesia (no memories before age 4)
- Recurring nightmares involving "white rooms" and "doctors"
- 2019: Sought hypnotherapy for nightmares, discontinued after 2 sessions

NOTE ON BIRTH RECORDS:
Marcus Chen's original birth certificate was destroyed in a courthouse fire in 1970. Replacement certificate lists place of birth as "County General Hospital" but hospital records from that period show no record of Sarah Chen or her son.

Sarah Chen (mother) - Death Certificate:
Date: December 14, 1967
Location: Blackwood Sanitarium
Cause: "Complications during childbirth"
Attending Physician: Dr. Harold Blackwood

FLAGGED INCONSISTENCY:
Blackwood Sanitarium was not a maternity facility. No obstetric services were ever offered at this location.`
    },
    {
      case_id: caseData.id,
      title: 'Coordinates Analysis',
      type: 'report',
      sort_order: 4,
      content: `GEOGRAPHIC ANALYSIS REPORT
Coordinates spoken in recording: 41.4032° N, 2.1743° W

LOCATION: Blackwood Sanitarium grounds
Specific area: Northeast corner of property, approximately 200 meters from main building

HISTORICAL USE: Designated as "Memorial Garden" in 1940s facility maps

GROUND PENETRATING RADAR SCAN (Conducted April 2024):
Results: CLASSIFIED - Level 4 clearance required

[PARTIAL DECLASSIFIED SUMMARY]
GPR scan detected multiple subsurface anomalies consistent with...
[REDACTED]
...estimated 12-15 distinct...
[REDACTED]
...depth of 1.8-2.4 meters...

RECOMMENDATION: Full excavation authorized pending...
[REMAINDER CLASSIFIED]

NOTE FROM ANALYST: Why would a "memorial garden" for a sanitarium show these readings? What exactly was being memorialized?`
    },
    {
      case_id: caseData.id,
      title: 'Declassified CIA Memo (Partial)',
      type: 'document',
      sort_order: 5,
      content: `[DOCUMENT HEADER REDACTED]
Classification: SECRET/NOFORN
Date: [REDACTED] 1965
Re: Project BLACKWOOD - Status Update

To: [REDACTED]
From: [REDACTED]

Phase 3 trials continue at the Blackwood facility. Dr. [REDACTED] reports promising results with Subject Group C (female, ages 18-35).

Audio-based conditioning shows 73% success rate in memory implantation. Subjects demonstrate no conscious recall of procedures while retaining implanted responses to trigger phrases.

CONCERNS:
1. Three subjects in Group C are currently pregnant. Dr. Blackwood recommends continuing trials despite this.
2. Offspring may inherit implanted memories (theoretical - requires long-term study)
3. Local staff asking questions. Recommend cover story about "therapeutic music research."

BUDGET:
Requesting additional $[REDACTED] for facility modifications and subject acquisition.

TERMINATION PROTOCOL:
Per standing orders, all Group C subjects will be processed following delivery of offspring. Remains to be interred in designated area per Protocol 7.

[REMAINDER OF DOCUMENT REDACTED]

DECLASSIFICATION NOTE: This document was released under FOIA request #[REDACTED]. Significant portions remain classified for national security reasons.`
    },
    {
      case_id: caseData.id,
      title: 'Chen Hypnotherapy Session Notes',
      type: 'transcript',
      sort_order: 6,
      content: `HYPNOTHERAPY SESSION TRANSCRIPT
Patient: Marcus Chen
Therapist: Dr. Anita Reeves
Date: September 15, 2019
Session: 2 of 2 (Patient discontinued treatment after this session)

[Beginning of relevant excerpt]

DR. REEVES: You're safe here, Marcus. I want you to go back to your earliest memory. What do you see?

CHEN: White. Everything is white. And cold.

DR. REEVES: Where are you?

CHEN: A room. There are... sounds. Someone is playing sounds.

DR. REEVES: What kind of sounds?

CHEN: Words. But backwards. Or... inside out. I don't know how to explain it.

DR. REEVES: Who else is there?

CHEN: Men in white coats. And... and my mother. She's crying.

DR. REEVES: Can you see her face?

CHEN: Yes. She's young. So young. She's saying something to me but I can't—

[Patient exhibits sudden distress]

CHEN: They're taking me away from her. She's reaching for me. She's saying "Remember me. Remember the garden. Forty-one point four—"

[Patient becomes unresponsive for approximately 45 seconds]

CHEN: [Speaking in female voice] They buried us in the garden. Mother is still waiting.

[Session terminated due to patient distress]

POST-SESSION NOTE: Patient refused further treatment. Claimed he "heard enough." Recommended psychiatric evaluation but patient declined.`
    }
  ]

  const { error: evidenceError } = await supabase
    .from('evidence')
    .insert(evidence)

  if (evidenceError) {
    console.error('Error inserting evidence:', evidenceError)
    return
  }

  console.log('Evidence inserted successfully!')
  console.log('Case #0002 ECHOES seeded successfully!')
}

seedCase002()
