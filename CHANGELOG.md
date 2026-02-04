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

## Notes

*This log will be updated after each deployment action.*
