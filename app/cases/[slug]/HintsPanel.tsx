'use client'

import { useState, useEffect } from 'react'
import { Analytics } from '@/lib/analytics'

interface HintsPanelProps {
  caseSlug: string
}

interface HintsData {
  hintsRevealed: number
  totalHints: number
  hints: string[]
  hasMoreHints: boolean
}

export default function HintsPanel({ caseSlug }: HintsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hintsData, setHintsData] = useState<HintsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)

  useEffect(() => {
    if (isOpen && !hintsData) {
      fetchHints()
    }
  }, [isOpen])

  const fetchHints = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/cases/${caseSlug}/hints`)
      if (res.ok) {
        const data = await res.json()
        setHintsData(data)
      }
    } catch (err) {
      console.error('Failed to fetch hints:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const revealNextHint = async () => {
    setIsRevealing(true)
    try {
      const res = await fetch(`/api/cases/${caseSlug}/hints`, {
        method: 'POST'
      })
      if (res.ok) {
        const data = await res.json()
        setHintsData({
          hintsRevealed: data.hintsRevealed,
          totalHints: data.totalHints,
          hints: data.hints,
          hasMoreHints: data.hasMoreHints
        })
        // Track hint request
        Analytics.hintRequested(caseSlug, data.hintsRevealed)
      }
    } catch (err) {
      console.error('Failed to reveal hint:', err)
    } finally {
      setIsRevealing(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/50 transition"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="font-medium">Investigation Hints</span>
          {hintsData && hintsData.hintsRevealed > 0 && (
            <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded">
              {hintsData.hintsRevealed}/{hintsData.totalHints} revealed
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable content */}
      {isOpen && (
        <div className="border-t border-zinc-800">
          {isLoading ? (
            <div className="px-6 py-8 text-center text-zinc-500">
              <div className="animate-spin w-6 h-6 border-2 border-zinc-600 border-t-amber-400 rounded-full mx-auto mb-2"></div>
              Loading hints...
            </div>
          ) : (
            <>
              {/* Warning */}
              <div className="px-6 py-3 bg-amber-900/10 border-b border-zinc-800">
                <p className="text-xs text-amber-400/80">
                  <strong>Warning:</strong> Using hints may affect your investigation rating.
                  Try reviewing the evidence thoroughly before requesting assistance.
                </p>
              </div>

              {/* Revealed Hints */}
              {hintsData && hintsData.hints.length > 0 && (
                <div className="px-6 py-4 space-y-3">
                  {hintsData.hints.map((hint, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-xs font-mono text-amber-400 mt-0.5">
                        #{index + 1}
                      </span>
                      <p className="text-sm text-zinc-300">{hint}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* No hints yet */}
              {hintsData && hintsData.hints.length === 0 && (
                <div className="px-6 py-6 text-center text-zinc-500">
                  <p className="text-sm mb-2">No hints revealed yet.</p>
                  <p className="text-xs">Stuck on the case? Request a hint below.</p>
                </div>
              )}

              {/* Reveal button */}
              {hintsData?.hasMoreHints && (
                <div className="px-6 py-4 border-t border-zinc-800">
                  <button
                    onClick={revealNextHint}
                    disabled={isRevealing}
                    className="w-full py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-700 text-amber-400 text-sm font-medium rounded transition disabled:opacity-50"
                  >
                    {isRevealing ? (
                      'Revealing...'
                    ) : (
                      <>
                        Reveal Hint #{(hintsData?.hintsRevealed || 0) + 1}
                        <span className="text-amber-400/60 ml-2">
                          ({hintsData.totalHints - hintsData.hintsRevealed} remaining)
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* All hints revealed */}
              {hintsData && !hintsData.hasMoreHints && hintsData.totalHints > 0 && (
                <div className="px-6 py-4 border-t border-zinc-800 text-center">
                  <p className="text-sm text-zinc-500">
                    All hints revealed. Good luck, investigator.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
