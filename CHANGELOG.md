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

**Status:** Pending

**Actions:**
- [ ] Create new repo on GitHub
- [ ] Add remote to local repo
- [ ] Push code to main branch

---

### Step 2: Deploy to Vercel

**Status:** Pending

**Actions:**
- [ ] Connect GitHub repo to Vercel
- [ ] Configure build settings
- [ ] Set environment variables

**Environment Variables Needed:**
```
NEXT_PUBLIC_SUPABASE_URL=https://srcutthsyiipxihozqpx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from .env.local]
SUPABASE_SERVICE_ROLE_KEY=[from .env.local]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[from .env.local]
STRIPE_SECRET_KEY=[from .env.local]
STRIPE_WEBHOOK_SECRET=[to be created]
NEXT_PUBLIC_SITE_URL=[vercel URL]
```

---

### Step 3: Configure Stripe Webhook

**Status:** Pending

**Actions:**
- [ ] Create webhook endpoint in Stripe Dashboard
- [ ] Point to: `https://[vercel-url]/api/webhooks/stripe`
- [ ] Subscribe to: `checkout.session.completed`
- [ ] Get signing secret

---

### Step 4: Update Supabase Auth

**Status:** Pending

**Actions:**
- [ ] Add production URL to redirect URLs
- [ ] Update site URL setting

---

### Step 5: Test Live Site

**Status:** Pending

**Tests:**
- [ ] Signup flow
- [ ] Login flow
- [ ] View free case
- [ ] Purchase premium case (test mode)
- [ ] Complete case submission

---

## Deployment URLs

| Service | URL |
|---------|-----|
| Supabase | https://srcutthsyiipxihozqpx.supabase.co |
| Vercel | TBD |
| GitHub | TBD |

---

## Notes

*This log will be updated after each deployment action.*
