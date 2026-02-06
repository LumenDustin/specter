import Stripe from 'stripe'

// Note: apiVersion should match your Stripe dashboard version
// Using 'as any' to avoid TypeScript version mismatches
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
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
