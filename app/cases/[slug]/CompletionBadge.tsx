'use client'

import { useState } from 'react'

interface CompletionBadgeProps {
  caseTitle: string
  caseNumber: string
  solutionType: 'surface' | 'true'
  completedAt: string
  attempts: number
}

export default function CompletionBadge({
  caseTitle,
  caseNumber,
  solutionType,
  completedAt,
  attempts
}: CompletionBadgeProps) {
  const [showCertificate, setShowCertificate] = useState(false)

  const formattedDate = new Date(completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const badgeColor = solutionType === 'true' ? 'green' : 'amber'
  const badgeTitle = solutionType === 'true' ? 'TRUE SOLUTION' : 'SURFACE SOLUTION'
  const rank = solutionType === 'true'
    ? attempts === 1 ? 'ELITE INVESTIGATOR' : 'SENIOR INVESTIGATOR'
    : 'INVESTIGATOR'

  return (
    <>
      {/* Badge Button */}
      <button
        onClick={() => setShowCertificate(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded border transition ${
          solutionType === 'true'
            ? 'bg-green-900/30 border-green-700 hover:bg-green-900/50 text-green-400'
            : 'bg-amber-900/30 border-amber-700 hover:bg-amber-900/50 text-amber-400'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <span className="text-sm font-medium">View Badge</span>
      </button>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="relative w-full max-w-lg">
            {/* Close button */}
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-zinc-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Certificate */}
            <div className={`bg-zinc-950 border-2 rounded-lg overflow-hidden ${
              solutionType === 'true' ? 'border-green-600' : 'border-amber-600'
            }`}>
              {/* Header */}
              <div className={`px-6 py-4 text-center ${
                solutionType === 'true' ? 'bg-green-900/30' : 'bg-amber-900/30'
              }`}>
                <p className="text-xs font-mono text-zinc-500 tracking-widest">SPECTER DIVISION</p>
                <h2 className="text-2xl font-bold font-mono mt-1">CASE COMPLETION</h2>
                <p className="text-xs font-mono text-zinc-500 mt-1">CERTIFICATE OF ACHIEVEMENT</p>
              </div>

              {/* Badge Icon */}
              <div className="flex justify-center py-6">
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
                  solutionType === 'true' ? 'bg-green-900/50' : 'bg-amber-900/50'
                }`}>
                  <div className={`absolute inset-2 rounded-full border-2 ${
                    solutionType === 'true' ? 'border-green-500' : 'border-amber-500'
                  }`} />
                  <svg className={`w-12 h-12 ${
                    solutionType === 'true' ? 'text-green-400' : 'text-amber-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {solutionType === 'true' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    )}
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 text-center">
                <p className={`text-sm font-mono tracking-wider ${
                  solutionType === 'true' ? 'text-green-400' : 'text-amber-400'
                }`}>
                  {badgeTitle}
                </p>

                <div className="mt-4 py-4 border-t border-b border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">CASE FILE</p>
                  <p className="font-mono text-lg">{caseNumber}</p>
                  <p className="text-zinc-300 mt-1">{caseTitle}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-zinc-500">COMPLETED</p>
                    <p className="font-mono text-sm">{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">ATTEMPTS</p>
                    <p className="font-mono text-sm">{attempts}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs text-zinc-500 mb-1">RANK ACHIEVED</p>
                  <p className={`font-mono font-bold ${
                    solutionType === 'true' ? 'text-green-400' : 'text-amber-400'
                  }`}>
                    {rank}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="mt-6 pt-4 border-t border-zinc-800">
                  <p className="text-[10px] text-zinc-600 font-mono">
                    SPECTER PARANORMAL INVESTIGATION DIVISION
                  </p>
                  <p className="text-[10px] text-zinc-600 font-mono">
                    {solutionType === 'true'
                      ? 'CLASSIFIED: TRUE SOLUTION DISCOVERED'
                      : 'CASE CLOSED: SURFACE EXPLANATION ACCEPTED'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
