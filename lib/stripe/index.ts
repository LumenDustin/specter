import Stripe from 'stripe'

// Lazy initialization to ensure env vars are available at runtime
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment')
    }
    console.log('Initializing Stripe with key starting with:', key.substring(0, 12) + '...')
    stripeInstance = new Stripe(key, {
      apiVersion: '2025-01-27.acacia' as any,
      typescript: true,
    })
  }
  return stripeInstance
}

// Case prices in cents
export const CASE_PRICES: Record<string, number> = {
  echoes: 499, // $4.99
  threshold: 699, // $6.99
}

// Get price for a case (returns 0 for free cases)
export function getCasePrice(slug: string): number {
  return CASE_PRICES[slug] || 0
}
