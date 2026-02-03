'use client'

import { useState, useEffect } from 'react'
import ShareButton from './ShareButton'
import CompletionBadge from './CompletionBadge'
import { Analytics } from '@/lib/analytics'

interface TheorySubmissionProps {
  caseSlug: string
  caseTitle: string
  caseNumber: string
}

interface SubmissionResult {
  result: 'surface' | 'true' | 'incorrect'
  feedback: string
  revealedSolution: string | null
  attempts: number
  bestResult: 'none' | 'surface' | 'true'
}

interface Progress {
  bestResult: 'none' | 'surface' | 'true'
  totalAttempts: number
  completed_at: string | null
}

export default function TheorySubmission({ caseSlug, caseTitle, caseNumber }: TheorySubmissionProps) {
  const [theory, setTheory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch existing progress on mount
  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch(`/api/cases/${caseSlug}/progress`)
        if (res.ok) {
          const data = await res.json()
          if (data.progress) {
            setProgress(data.progress)
          }
        }
      } catch (err) {
        console.error('Failed to fetch progress:', err)
      }
    }
    fetchProgress()
  }, [caseSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/cases/${caseSlug}/submit-theory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theory })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to submit theory')
        return
      }

      setResult(data)
      setProgress({
        bestResult: data.bestResult,
        totalAttempts: data.attempts,
        completed_at: data.result !== 'incorrect' ? new Date().toISOString() : null
      })

      // Track analytics
      Analytics.theorySubmitted(caseSlug, data.result)
      if (data.result === 'true' || data.result === 'surface') {
        Analytics.caseSolved(caseSlug, data.result, data.attempts)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTheory('')
    setResult(null)
    setShowForm(true)
  }

  // Show completed state if user already solved the case
  if (progress?.bestResult === 'true' && !showForm && !result) {
    return (
      <div className="bg-zinc-900 border border-green-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-400">Case Solved - TRUE Solution Found</h3>
            <p className="text-sm text-zinc-400">Completed in {progress.totalAttempts} attempt{progress.totalAttempts !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <CompletionBadge
            caseTitle={caseTitle}
            caseNumber={caseNumber}
            solutionType="true"
            completedAt={progress.completed_at || new Date().toISOString()}
            attempts={progress.totalAttempts}
          />
          <ShareButton caseTitle={caseTitle} caseSlug={caseSlug} solutionType="true" />
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-zinc-400 hover:text-zinc-200 transition"
          >
            Submit another theory →
          </button>
        </div>
      </div>
    )
  }

  if (progress?.bestResult === 'surface' && !showForm && !result) {
    return (
      <div className="bg-zinc-900 border border-amber-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-400">Case Closed - Surface Solution</h3>
            <p className="text-sm text-zinc-400">
              You found an explanation, but there may be more to uncover...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <CompletionBadge
            caseTitle={caseTitle}
            caseNumber={caseNumber}
            solutionType="surface"
            completedAt={progress.completed_at || new Date().toISOString()}
            attempts={progress.totalAttempts}
          />
          <ShareButton caseTitle={caseTitle} caseSlug={caseSlug} solutionType="surface" />
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded transition"
          >
            Dig Deeper
          </button>
        </div>
      </div>
    )
  }

  // Show result after submission
  if (result) {
    return (
      <div className={`bg-zinc-900 border rounded-lg overflow-hidden ${
        result.result === 'true' ? 'border-green-800' :
        result.result === 'surface' ? 'border-amber-800' :
        'border-red-800'
      }`}>
        {/* Result Header */}
        <div className={`px-6 py-4 ${
          result.result === 'true' ? 'bg-green-900/30' :
          result.result === 'surface' ? 'bg-amber-900/30' :
          'bg-red-900/30'
        }`}>
          <div className="flex items-center gap-3">
            {result.result === 'true' ? (
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : result.result === 'surface' ? (
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div>
              <h3 className={`text-xl font-bold ${
                result.result === 'true' ? 'text-green-400' :
                result.result === 'surface' ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {result.result === 'true' ? 'TRUE SOLUTION FOUND' :
                 result.result === 'surface' ? 'SURFACE SOLUTION' :
                 'THEORY REJECTED'}
              </h3>
              <p className="text-sm text-zinc-400">Attempt #{result.attempts}</p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <p className="text-zinc-300 font-mono text-sm">{result.feedback}</p>
        </div>

        {/* Revealed Solution */}
        {result.revealedSolution && (
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950">
            <h4 className="text-xs font-mono text-zinc-500 mb-2">
              {result.result === 'true' ? '[ CLASSIFIED - TRUE SOLUTION ]' : '[ OFFICIAL EXPLANATION ]'}
            </h4>
            <p className="text-zinc-300 text-sm">{result.revealedSolution}</p>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 flex gap-4">
          {result.result === 'incorrect' && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition"
            >
              Try Again
            </button>
          )}
          {result.result === 'surface' && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded transition"
            >
              Dig Deeper
            </button>
          )}
          <a
            href="/cases"
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded transition"
          >
            Back to Cases
          </a>
        </div>
      </div>
    )
  }

  // Show submission form
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950">
        <h3 className="text-lg font-semibold">Submit Your Theory</h3>
        <p className="text-sm text-zinc-400">
          Based on the evidence, what do you believe happened at {caseTitle}?
        </p>
        {progress && progress.totalAttempts > 0 && (
          <p className="text-xs text-zinc-500 mt-2">
            Previous attempts: {progress.totalAttempts}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
          <label htmlFor="theory" className="block text-sm font-medium text-zinc-300 mb-2">
            Your Theory
          </label>
          <textarea
            id="theory"
            value={theory}
            onChange={(e) => setTheory(e.target.value)}
            placeholder="Describe what you believe happened, who is responsible, and why. Be specific and reference the evidence..."
            className="w-full h-40 px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none font-mono text-sm"
            required
            minLength={20}
          />
          <p className="text-xs text-zinc-500 mt-1">
            Minimum 20 characters. {theory.length}/20
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-800 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Your theory will be analyzed against classified intelligence.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || theory.length < 20}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded transition"
          >
            {isSubmitting ? 'Analyzing...' : 'Submit Theory'}
          </button>
        </div>
      </form>
    </div>
  )
}
