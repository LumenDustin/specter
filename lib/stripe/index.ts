import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

// Case prices in cents
export const CASE_PRICES: Record<string, number> = {
  echoes: 499, // $4.99
  threshold: 699, // $6.99
}

// Get price for a case (returns 0 for free cases)
export function getCasePrice(slug: string): number {
  return CASE_PRICES[slug] || 0
}
