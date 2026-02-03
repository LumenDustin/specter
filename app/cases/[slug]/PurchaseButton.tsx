'use client'

import { useState } from 'react'
import { Analytics } from '@/lib/analytics'

interface PurchaseButtonProps {
  caseSlug: string
  caseTitle: string
  price: number // in cents
}

export default function PurchaseButton({ caseSlug, caseTitle, price }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async () => {
    setIsLoading(true)
    setError(null)
    Analytics.purchaseStarted(caseSlug, price)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseSlug }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  const formattedPrice = (price / 100).toFixed(2)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h3 className="text-xl font-bold mb-2">Classified Case File</h3>
        <p className="text-zinc-400 mb-4">
          Purchase access to investigate <span className="text-zinc-200">{caseTitle}</span>
        </p>

        <div className="mb-6">
          <span className="text-4xl font-bold text-white">${formattedPrice}</span>
          <span className="text-zinc-500 ml-2">one-time</span>
        </div>

        <ul className="text-left text-sm text-zinc-400 mb-6 space-y-2">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Full access to all evidence
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited theory submissions
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Investigation hints available
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Permanent access to case file
          </li>
        </ul>

        {error && (
          <div className="mb-4 px-4 py-2 bg-red-900/30 border border-red-800 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Purchase Case - ${formattedPrice}
            </>
          )}
        </button>

        <p className="text-xs text-zinc-600 mt-4">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  )
}
