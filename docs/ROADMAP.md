# SPECTER - Product Roadmap

## Current Status: MVP Live 🎉
**Production URL:** https://specter-game.vercel.app

---

## Completed Features

### Core Game
- [x] 3 investigation cases with evidence
- [x] Two-tier mystery system (surface + true solution)
- [x] Evidence review and note-taking
- [x] Theory submission and validation
- [x] Progressive hints system
- [x] User progress tracking

### Authentication & Payments
- [x] Email/password authentication (Supabase)
- [x] Stripe payment integration
- [x] Free case + premium case model

### Visual Assets
- [x] AI-generated evidence images (17 images via DALL-E)
- [x] Dark theme UI with paranormal aesthetic

### Infrastructure
- [x] Vercel deployment with auto-deploy
- [x] GitHub repository
- [x] Supabase database with RLS
- [x] Stripe webhooks configured

---

## Phase 2: Audio/Visual Enhancement 🎯

### Priority 1: Audio Evidence (ElevenLabs)

**Case #2: The Blackwood Recording** *(Critical - case revolves around audio)*
- [ ] Create the actual "Blackwood Recording" audio file
  - Normal speech with unexplained whispers layered in
  - Static/interference effects
  - Duration: 2-3 minutes
- [ ] Add audio player component to EvidenceCard
- [ ] Store audio in Supabase Storage or `/public/audio/`

**Case #1: The Hartwell Incident**
- [ ] EVP recordings with ghostly voices
- [ ] Child humming/singing (creepy nursery rhyme)
- [ ] Radio static/interference

**Case #3: The Millbrook Disappearances**
- [ ] 1920s-style radio broadcast recreation
- [ ] Crackling gramophone recording
- [ ] Whispered chanting (Threshold Society ritual)

### Priority 2: Video Content

**Case Briefing Videos** (30-60 seconds each)
- [ ] TV static intro/outro transitions
- [ ] Redacted document reveals
- [ ] Case number/classification display
- [ ] Narrated briefing (text-to-speech or voice actor)

**Evidence Footage**
- [ ] Hartwell: Thermal camera video (humanoid cold spot moving)
- [ ] Blackwood: Security camera footage (grainy, timestamped)
- [ ] Millbrook: VHS-style degraded video of forest area

### Technical Implementation
- [ ] Create AudioPlayer component
- [ ] Create VideoPlayer component
- [ ] Add `audio_url` column to evidence table
- [ ] Add `video_url` column to evidence table
- [ ] Set up Supabase Storage buckets for media
- [ ] Consider CDN for video delivery (Vercel bandwidth limits)

---

## Phase 3: Mobile App Deployment

### iOS (App Store)
- [ ] Generate all app icon sizes
- [ ] Configure splash screens
- [ ] Test on iOS Simulator
- [ ] Apple Developer account ($99/year)
- [ ] App Store screenshots (6.5" and 5.5")
- [ ] Privacy policy URL
- [ ] App Store listing copy
- [ ] Submit for review

### Android (Google Play)
- [ ] Generate all app icon sizes
- [ ] Configure splash screens
- [ ] Test on Android Emulator
- [ ] Google Play Developer account ($25)
- [ ] Play Store screenshots
- [ ] Submit for review

### In-App Purchases
- [ ] Replace Stripe with native IAP for mobile
- [ ] Configure products in App Store Connect
- [ ] Configure products in Google Play Console

---

## Phase 4: Content Expansion

### New Cases
- [ ] Case #4: [TBD] - Research and write
- [ ] Case #5: [TBD] - Research and write
- [ ] Case #6: [TBD] - Research and write

### Case Themes to Explore
- Haunted locations (hotels, hospitals, ships)
- Cryptids and creature sightings
- UFO/alien encounters
- Time anomalies
- Cult/occult investigations
- Historical mysteries with paranormal twist

---

## Phase 5: Growth & Monetization

### Marketing
- [ ] Custom domain (specter.dev or similar)
- [ ] Social media presence
- [ ] Content creator outreach
- [ ] SEO optimization

### Analytics & Optimization
- [ ] Google Analytics setup
- [ ] User behavior tracking
- [ ] A/B testing for conversion
- [ ] Email marketing (case announcements)

### Monetization Expansion
- [ ] Subscription model option
- [ ] Case bundles/season passes
- [ ] Merchandise (investigation kits, pins)

---

## Technical Debt & Improvements

- [ ] Migrate middleware to Next.js proxy (deprecation warning)
- [ ] Add comprehensive error handling
- [ ] Add loading states/skeletons
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Unit/integration tests

---

## Notes

**Audio Tools:**
- ElevenLabs - Voice generation, sound effects
- Suno - Music/ambient audio generation
- Audacity - Audio editing

**Video Tools:**
- Runway ML - AI video generation
- CapCut - Video editing
- After Effects - Motion graphics

**Last Updated:** February 3, 2026
