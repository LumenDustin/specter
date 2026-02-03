import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedCase003() {
  console.log('Seeding Case #0003 - THRESHOLD...')

  // Insert the case
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .insert({
      slug: 'threshold',
      title: 'The Millbrook Disappearances',
      case_number: '0003',
      classification: 'RED',
      difficulty: 'expert',
      briefing: `CLASSIFICATION: LEVEL 4 - MASS DISAPPEARANCE EVENT

CASE BRIEFING: THRESHOLD

Between October 1st and October 31st, 2023, the town of Millbrook, Vermont (population 2,847) experienced 13 unexplained disappearances. All victims vanished from their homes between 3:00 AM and 3:17 AM.

Common factors among the missing:
• All were lifelong Millbrook residents
• Ages ranged from 23 to 67
• No signs of forced entry or struggle
• Personal belongings left behind, including phones and wallets
• Each victim was last seen going to bed normally the night before

The disappearances stopped on November 1st. No bodies have been recovered. No ransom demands. No sightings.

Local authorities initially suspected a serial abductor, but FBI involvement revealed disturbing details:
• Millbrook has experienced similar "October waves" in 1923, 1973, and now 2023
• Exactly 13 people disappeared each time
• The 1923 and 1973 cases remain unsolved

Town records show Millbrook was founded in 1823 by the Threshold Society, a religious group with no surviving documentation.

Your task: Analyze the evidence, identify the pattern connecting these disappearances across a century, and determine what happened to the missing residents.

WARNING: Two investigators assigned to this case in 1973 subsequently disappeared. Exercise caution.`,
      surface_solution: 'The disappearances are the work of a multi-generational cult operating in Millbrook. Every 50 years, they sacrifice 13 "chosen" residents in a ritual. The cult operates from hidden tunnels beneath the town.',
      true_solution: 'Millbrook was built on a "thin place" where dimensional barriers weaken every 50 years in October. The Threshold Society didn\'t worship a deity - they were guardians trying to PREVENT crossings. The 13 who disappear each cycle are being pulled through to another dimension. The founder\'s descendants still maintain the vigil, but the barrier is weakening. The 2023 victims aren\'t dead - they\'re trapped on the other side, and the increasing frequency of disappearances suggests a permanent breach is imminent.',
      is_free: false,
      is_published: true,
      estimated_time_minutes: 60
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
      title: 'Victim List & Timeline',
      type: 'document',
      sort_order: 1,
      content: `MILLBROOK DISAPPEARANCES - OCTOBER 2023
Official Record - Vermont State Police

VICTIM MANIFEST:

1. Eleanor Vance, 67 - October 1, 3:04 AM
   Retired librarian. Last seen by husband at 10 PM.

2. Thomas Marsh, 45 - October 3, 3:11 AM
   Town selectman. Wife heard him get up for water, never returned.

3. Abigail Stone, 34 - October 5, 3:00 AM
   Elementary school teacher. Bedroom window found open.

4. Richard Carver, 52 - October 8, 3:17 AM
   Local historian. Extensive notes on town history found in study.

5. Sarah Whitmore, 23 - October 10, 3:07 AM
   Recent college graduate. Parents heard footsteps, then silence.

6. James Holloway, 58 - October 12, 3:03 AM
   Owner of Holloway Hardware. Dog was found whimpering at bedroom door.

7. Margaret Frost, 41 - October 15, 3:09 AM
   Real estate agent. Sold several properties on Threshold Road.

8. Daniel Crane, 29 - October 17, 3:14 AM
   Volunteer firefighter. Roommate reported strange lights.

9. Patricia Wells, 55 - October 20, 3:02 AM
   Church organist. Bible found open to Revelation.

10. Robert Aldrich, 36 - October 22, 3:08 AM
    IT consultant, worked remotely. Security camera shows static at 3:07 AM.

11. Catherine Moore, 48 - October 25, 3:12 AM
    Nurse. Night shift colleague says she seemed "distracted" lately.

12. William Thorn, 61 - October 28, 3:05 AM
    Retired police chief. Investigated 1973 disappearances as rookie.

13. Elizabeth Ward, 31 - October 31, 3:17 AM
    The last to vanish. Found journal entries about "seeing them."

PATTERN ANALYSIS:
- All times between 3:00-3:17 AM (the "witching hour")
- No victim lived on the same street
- When mapped, victim homes form a perfect circle around town center
- Center point: The old Threshold Society meeting hall (now abandoned)`
    },
    {
      case_id: caseData.id,
      title: '1923 Newspaper Archive',
      type: 'document',
      sort_order: 2,
      content: `THE MILLBROOK SENTINEL
November 2, 1923

THIRTEEN SOULS LOST TO UNKNOWN FATE
Town Gripped by Fear as Month of Terror Ends

By Harold Greene, Editor

The dark month of October has passed, leaving our community forever changed. Thirteen of our neighbors have vanished without explanation, taken from their beds in the still hours of night.

Sheriff Abel Morrison has exhausted all avenues of investigation. "It's as if they simply ceased to exist," he told this reporter. "No tracks, no struggle, no witness. In my thirty years of service, I have never encountered such a mystery."

The missing include some of our most prominent citizens: Dr. Ezra Blackwood, schoolmistress Clara Finch, and mill owner Josiah Crane among them.

Reverend Silas Ward of First Congregational Church delivered a sermon Sunday urging calm. "The Lord works in mysterious ways," he said. "We must have faith that our brothers and sisters are in His hands."

But others whisper of older explanations. This reporter has heard talk of the town's founders and their strange beliefs. The Threshold Society, which established Millbrook exactly one hundred years ago, left few records of their practices.

Elder townspeople recall their grandparents speaking of a "covenant" made when the town was founded. What that covenant entailed, none will say directly.

One thing is certain: Millbrook will never be the same.

[EDITOR'S NOTE: Harold Greene disappeared October 15, 1973, fifty years after writing this article.]`
    },
    {
      case_id: caseData.id,
      title: 'Richard Carver\'s Research Notes',
      type: 'document',
      sort_order: 3,
      content: `PERSONAL RESEARCH NOTES - RICHARD CARVER
Local Historian
(Found in Carver's study after his disappearance)

THE THRESHOLD SOCIETY - What I've Pieced Together

The Society was founded in England, 1785, by Nathaniel Threshold. Not a surname - a title. He claimed to have witnessed a "thinning" of reality and dedicated his life to studying these phenomena.

They came to America in 1820, searching for a specific location. Threshold's journals (fragments in the Vermont Historical Society) mention "a place where the veil is worn thin, where They press against the membrane of our world."

They found it here. Founded Millbrook in 1823.

IMPORTANT: They weren't trying to SUMMON anything. The documents I've found suggest they were trying to PREVENT something from coming through. The town is literally built as a containment system.

The 13 houses originally built by the Society form a perfect circle - they called it "the Ring." Each house had a family tasked with maintaining specific "wards."

But here's what terrifies me: The wards are failing.

In 1823, they expected the thinning to happen every 100 years. It happened in 1923 - exactly as predicted. But then it happened again in 1973, only 50 years later.

If the pattern is accelerating...

The 13 who disappear aren't random victims. They're ANCHORS. The descendants of the original 13 families. When the thinning happens, they're pulled through because their bloodlines are tied to this place.

Oh God. I just realized. My family has been here since the founding. I'm a Carver. One of the original 13 families.

I need to talk to Chief Thorn. He investigated in '73. He must know more than he's—

[Notes end here]`
    },
    {
      case_id: caseData.id,
      title: 'Elizabeth Ward\'s Journal',
      type: 'document',
      sort_order: 4,
      content: `JOURNAL OF ELIZABETH WARD
(Final entries before disappearance)

October 25, 2023

They're getting clearer now. Every night when I close my eyes, I see them pressing against something invisible. Shapes that aren't quite human. Reaching.

I told Dr. Morrison I was having nightmares. She prescribed sleeping pills. They don't help. When I sleep, I can hear them more clearly.

Grandmother used to tell me our family was "special." That we had a "responsibility to Millbrook." She said the same thing her grandmother told her.

I thought she was just a superstitious old woman. But now I understand.

October 28, 2023

Catherine disappeared last night. That makes 12.

I know I'm next. I can feel it like a hook behind my navel, pulling.

I found Grandmother's letters in the attic. She knew. The Wards have ALWAYS known. We're one of the 13 families. We're not victims - we're supposed to be guardians.

But the Society fell apart. The knowledge was lost. Now no one maintains the wards, and the barrier is failing.

October 30, 2023

I saw them clearly tonight. Not in dreams - with my eyes open.

They're not monsters. They're people. Wearing old clothes. Victorian, maybe older.

One of them spoke to me. She said: "We're still here. All of us. Trapped between. The door opens both ways."

I think... I think the 13 from 1923 are still alive. Still on the other side. Waiting.

October 31, 2023

It's 2:47 AM. I can feel the pull getting stronger.

If anyone finds this: We made a mistake. The Threshold Society wasn't a cult. They were protecting us all.

The 13 who vanish become part of the barrier. We hold it closed with our—

[Journal ends mid-sentence]`
    },
    {
      case_id: caseData.id,
      title: 'Chief Thorn\'s 1973 Case File',
      type: 'document',
      sort_order: 5,
      content: `MILLBROOK POLICE DEPARTMENT
Case #73-1031
Investigating Officer: William Thorn (then Deputy)
Classification: UNSOLVED - SEALED

[FILE PARTIALLY REDACTED BY STATE AUTHORITY]

PERSONAL NOTES (not included in official report):

I was 23 years old in October 1973. First year on the force. I thought I knew how the world worked.

I was wrong.

Thirteen people disappeared that month. Same pattern as 1923 - we found the old newspaper articles. Everyone thought it was a sick copycat, some anniversary killer.

Then I saw something.

October 29, 1973. 3:14 AM. I was parked outside the Peterson house (they were on the likely victim list based on the pattern). I saw Mr. Peterson walk out his front door. He was sleepwalking, eyes wide open.

I called out to him. He didn't respond. Started walking toward the old meeting hall in the town center.

I followed. What choice did I have?

What I saw at that building... [TEXT HEAVILY REDACTED]

The air itself was wrong. Like looking at heat shimmer, but cold. And through it, I could see...

People. Dozens of them. Standing in rows. Looking at us.

Peterson walked toward them. I tried to grab him but my hands passed through him like he was made of smoke.

He stepped through and was gone.

I told the state investigators. They put me on administrative leave. Said I was traumatized. Made me sign papers agreeing to never discuss this again.

But I never forgot. I've spent 50 years waiting.

And now it's happening again. And I know, somehow, that this time it's coming for me too.

I'm a Thorn. We were one of the founding families.

I should have left Millbrook years ago. But something kept me here.

Now I know what.

[FILE ENDS]`
    },
    {
      case_id: caseData.id,
      title: 'Threshold Society Charter (1823)',
      type: 'document',
      sort_order: 6,
      content: `THE COVENANT OF THE THRESHOLD SOCIETY
Established this day of March 15, in the Year of Our Lord 1823

We, the undersigned, having witnessed that which presses against the boundaries of our world, do solemnly covenant to protect humanity from incursion.

ARTICLE I: THE BOUNDARY
We have identified a location where the membrane between worlds grows thin. Upon this ground we shall build our town, that we may guard the Threshold for all generations.

ARTICLE II: THE THIRTEEN
Thirteen families shall form the Ring. Each family shall maintain one segment of the ward. The bloodlines must never leave Millbrook, for they are bound to this place by sacred duty.

ARTICLE III: THE THINNING
Every century, when the stars align and the veil grows weak, the Threshold may open. The Thirteen must perform the Sealing Ritual to reinforce the barrier. Should they fail, the crossing shall occur.

ARTICLE IV: THE PRICE
Should the barrier fail, the Thirteen shall become the barrier. Their spirits shall join those who crossed before, forever holding the door closed from the other side.

This is not punishment. This is purpose.

ARTICLE V: THE WARNING
The entities beyond the Threshold are not evil. They are simply OTHER. They do not wish to harm us. They wish to EXIST here. But our world cannot sustain their presence.

If they cross in numbers, reality itself will begin to unravel.

SIGNATORIES:
Nathaniel Threshold, Founder
Ezekiel Ward, First Guardian
Abraham Carver, Keeper of Records
Josiah Crane, Warden of the East
[...remaining 9 signatures...]

ADDENDUM (added 1923):
The Thinning has come early. The cycle accelerates. We fear the barrier weakens. May God forgive us if we have failed.

ADDENDUM (added 1973):
Only three families remember. The others have forgotten. The ritual was incomplete. The Thirteen were taken, but the seal is fragile.

ADDENDUM (added 2023):
[Page is blank except for a single word written in shaking hand]

SOON.`
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
  console.log('Case #0003 THRESHOLD seeded successfully!')
}

seedCase003()
