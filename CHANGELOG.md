# SPECTER - Deployment Changelog

This document tracks all deployment steps, configurations, and changes made during the deployment process.

---

## February 3, 2026

### Session Start - Deployment Phase

**Current State:**
- Code: 100% complete (3 investigation cases, auth, Stripe payments, mobile support)
- Supabase: Active and healthy
  - Project: `specter-game`
  - ID: `srcutthsyiipxihozqpx`
  - Region: us-west-2
- GitHub: Not configured
- Vercel: Not deployed

---

### Step 1: Create GitHub Repository

**Status:** COMPLETE

**Actions:**
- [x] Create new repo on GitHub
- [x] Add remote to local repo
- [x] Push code to main branch

**Result:**
- Repository: https://github.com/LumenDustin/specter
- Branch: main
- Authenticated via: GitHub CLI (`gh auth login`)

---

### Step 2: Deploy to Vercel

**Status:** COMPLETE

**Actions:**
- [x] Connect GitHub repo to Vercel
- [x] Configure build settings
- [x] Set environment variables

**Deployment Details:**
- Project: `specter-game`
- Production URL: https://specter-game.vercel.app
- Build: Next.js 16.1.6 (Turbopack)
- Region: iad1 (Washington, D.C.)

**Environment Variables Set:**
- `NEXT_PUBLIC_SUPABASE_URL` ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓
- `SUPABASE_SERVICE_ROLE_KEY` ✓
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ✓
- `STRIPE_SECRET_KEY` ✓
- `NEXT_PUBLIC_SITE_URL` ✓
- `RESEND_API_KEY` ✓
- `EMAIL_FROM` ✓

---

### Step 3: Configure Stripe Webhook

**Status:** COMPLETE

**Actions:**
- [x] Create webhook endpoint in Stripe Dashboard
- [x] Point to: `https://specter-game.vercel.app/api/webhooks/stripe`
- [x] Subscribe to: `checkout.session.completed`
- [x] Get signing secret

**Configuration:**
- Destination name: `specter-production-CL`
- Description: `SPECTER game checkout webhook`
- Event: `checkout.session.completed`
- Signing secret: Added to Vercel as `STRIPE_WEBHOOK_SECRET`

---

### Step 4: Update Supabase Auth

**Status:** COMPLETE

**Actions:**
- [x] Add production URL to redirect URLs
- [x] Update site URL setting

**Configuration:**
- Site URL: `https://specter-game.vercel.app`
- Redirect URLs: `https://specter-game.vercel.app/**`, `http://localhost:3001/**`

---

### Step 5: Test Live Site

**Status:** IN PROGRESS

**Tests:**
- [x] Landing page loads correctly
- [ ] Signup flow
- [ ] Login flow
- [ ] View free case
- [ ] Purchase premium case (test mode)
- [ ] Login flow
- [ ] View free case
- [ ] Purchase premium case (test mode)
- [ ] Complete case submission

---

## Deployment URLs

| Service | URL |
|---------|-----|
| Supabase | https://srcutthsyiipxihozqpx.supabase.co |
| Vercel | https://specter-game.vercel.app |
| GitHub | https://github.com/LumenDustin/specter |

---

### Step 6: Add Evidence Images

**Status:** COMPLETE (v2 - HTML Templates)

**Initial Approach (DALL-E):**
- [x] Create DALL-E image generation script
- [x] Generate 17 AI images (~$0.68)
- Issue: AI-generated text was illegible gibberish

**Final Approach (HTML Templates):**
- [x] Created 17 HTML/CSS document templates with readable text
- [x] Added Puppeteer render script
- [x] Rendered all templates to PNG at 2x resolution
- [x] Deployed to Vercel

**Templates Created:**
| Case | Document | File |
|------|----------|------|
| Hartwell | Police Report | `police-report.html` |
| Hartwell | Property Records | `property-records.html` |
| Hartwell | Emma's Drawing | `emma-drawing.html` |
| Hartwell | Thermal Imaging | `thermal-imaging.html` |
| Hartwell | Missing Poster | `missing-person.html` |
| Blackwood | Audio Waveform | `audio-waveform.html` |
| Blackwood | Sanitarium Photo | `sanitarium.html` |
| Blackwood | Chen ID/Clearance | `chen-id.html` |
| Blackwood | Coordinates Map | `coordinates-map.html` |
| Blackwood | CIA Memo | `cia-memo.html` |
| Blackwood | Hypnotherapy Notes | `hypnotherapy-notes.html` |
| Millbrook | Timeline Board | `timeline.html` |
| Millbrook | 1923 Newspaper | `newspaper-1923.html` |
| Millbrook | Carver's Notes | `carver-notes.html` |
| Millbrook | Ward's Journal | `ward-journal.html` |
| Millbrook | 1973 Case File | `case-file-1973.html` |
| Millbrook | Threshold Charter | `threshold-charter.html` |

**Scripts Added:**
- `scripts/render-templates.js` - Puppeteer PNG renderer
- `scripts/templates/` - 17 HTML template files

---

## Deployment URLs

| Service | URL |
|---------|-----|
| Supabase | https://srcutthsyiipxihozqpx.supabase.co |
| Vercel | https://specter-game.vercel.app |
| GitHub | https://github.com/LumenDustin/specter |

---

## Roadmap

See `docs/ROADMAP.md` for full product roadmap including:
- Phase 2: Audio/Visual Enhancement (ElevenLabs, video content)
- Phase 3: Mobile App Deployment (iOS, Android)
- Phase 4: Content Expansion (new cases)
- Phase 5: Growth & Monetization

---

## Notes

*This log will be updated after each deployment action.*
