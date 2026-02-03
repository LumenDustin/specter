# SPECTER Deployment Guide

## Web Deployment (Vercel)

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your SPECTER repository
4. Vercel will auto-detect Next.js

### 2. Configure Environment Variables

Add these environment variables in Vercel's project settings:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://srcutthsyiipxihozqpx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (use LIVE keys for production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site URL (your Vercel domain)
NEXT_PUBLIC_SITE_URL=https://specter.dev

# Resend Email
RESEND_API_KEY=re_xxx
EMAIL_FROM=SPECTER <noreply@specter.dev>
```

### 3. Set Up Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events: `checkout.session.completed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Configure Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain (e.g., specter.dev)
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` to your domain

### 5. Deploy

Push to your main branch - Vercel will auto-deploy!

---

## Mobile Deployment (iOS & Android)

### Prerequisites

- **iOS**: macOS with Xcode 15+ installed, Apple Developer account ($99/year)
- **Android**: Android Studio installed, Google Play Developer account ($25 one-time)

### 1. Build for Mobile

```bash
# Build the static export
npm run build:mobile
```

This will:
1. Build Next.js with static export
2. Sync with Capacitor native projects

### 2. iOS Deployment

```bash
# Open in Xcode
npm run cap:ios
```

In Xcode:
1. Select your team in Signing & Capabilities
2. Update the Bundle Identifier if needed
3. Product → Archive
4. Distribute to App Store

### 3. Android Deployment

```bash
# Open in Android Studio
npm run cap:android
```

In Android Studio:
1. Build → Generate Signed Bundle/APK
2. Create or use existing keystore
3. Upload to Google Play Console

### 4. In-App Purchases (Required for Mobile)

For mobile app stores, you'll need to replace Stripe with native IAP:

1. Install Capacitor IAP plugin:
   ```bash
   npm install @capgo/capacitor-purchases
   ```

2. Set up products in:
   - App Store Connect (iOS)
   - Google Play Console (Android)

3. Update PurchaseButton.tsx to use native IAP on mobile

---

## Development Workflow

### Live Reload on Device

1. Edit `capacitor.config.ts`:
   ```ts
   const useDevServer = true
   ```

2. Update the IP to your machine's local IP

3. Run:
   ```bash
   npm run dev          # Start Next.js
   npm run cap:sync     # Sync changes
   npm run cap:ios      # Open Xcode
   ```

4. Run on device/simulator from Xcode

### Building Updates

After code changes:
```bash
npm run build:mobile   # Rebuild and sync
npm run cap:ios        # Open in Xcode
```

---

## Checklist Before Launch

### Web
- [ ] All environment variables set in Vercel
- [ ] Stripe webhook configured with production URL
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Test purchase flow with Stripe test mode
- [ ] Switch to Stripe live keys
- [ ] Test email delivery

### Mobile
- [ ] App icons generated (all sizes)
- [ ] Splash screen configured
- [ ] App Store screenshots prepared
- [ ] Privacy policy URL ready
- [ ] App Store listing copy written
- [ ] In-app purchases configured
- [ ] Test on real devices
- [ ] Submit for review

---

## Troubleshooting

### Vercel Build Fails
- Check build logs for missing env variables
- Ensure all dependencies are in package.json

### Capacitor Sync Issues
- Delete `ios/App/App/public` and `android/app/src/main/assets/public`
- Run `npm run cap:sync` again

### iOS Signing Issues
- Ensure Apple Developer account is active
- Check Xcode automatic signing settings

### Android Build Issues
- Ensure Java 17+ is installed
- Check Android SDK location in Android Studio
