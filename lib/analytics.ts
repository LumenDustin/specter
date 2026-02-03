// Google Analytics event tracking utilities

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// Track a custom event
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track case-specific events
export const Analytics = {
  // Track when a user starts investigating a case
  caseStarted: (caseSlug: string, caseTitle: string) => {
    trackEvent('case_started', 'Case', `${caseSlug}: ${caseTitle}`)
  },

  // Track when a user submits a theory
  theorySubmitted: (caseSlug: string, result: 'true' | 'surface' | 'incorrect') => {
    trackEvent('theory_submitted', 'Case', `${caseSlug}: ${result}`)
  },

  // Track when a user solves a case
  caseSolved: (caseSlug: string, solutionType: 'true' | 'surface', attempts: number) => {
    trackEvent('case_solved', 'Case', `${caseSlug}: ${solutionType}`, attempts)
  },

  // Track when a user requests a hint
  hintRequested: (caseSlug: string, hintNumber: number) => {
    trackEvent('hint_requested', 'Case', `${caseSlug}: hint ${hintNumber}`)
  },

  // Track when a user reviews evidence
  evidenceReviewed: (caseSlug: string, evidenceTitle: string) => {
    trackEvent('evidence_reviewed', 'Case', `${caseSlug}: ${evidenceTitle}`)
  },

  // Track when a user makes a purchase
  purchaseStarted: (caseSlug: string, price: number) => {
    trackEvent('purchase_started', 'Ecommerce', caseSlug, price)
  },

  // Track when a purchase is completed
  purchaseCompleted: (caseSlug: string, price: number) => {
    trackEvent('purchase_completed', 'Ecommerce', caseSlug, price)
  },

  // Track social shares
  socialShare: (caseSlug: string, platform: string) => {
    trackEvent('social_share', 'Social', `${caseSlug}: ${platform}`)
  },

  // Track user sign up
  signUp: (method: string) => {
    trackEvent('sign_up', 'User', method)
  },

  // Track user login
  login: (method: string) => {
    trackEvent('login', 'User', method)
  },
}
