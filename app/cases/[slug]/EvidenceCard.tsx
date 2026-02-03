'use client'

import { useState } from 'react'
import { Analytics } from '@/lib/analytics'

interface EvidenceCardProps {
  evidence: {
    id: string
    title: string
    type: string
    content: string
    image_url: string | null
  }
  index: number
  caseSlug: string
  initialReviewed?: boolean
  initialNote?: string
}

export default function EvidenceCard({
  evidence,
  index,
  caseSlug,
  initialReviewed = false,
  initialNote = ''
}: EvidenceCardProps) {
  const [reviewed, setReviewed] = useState(initialReviewed)
  const [note, setNote] = useState(initialNote)
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleMarkReviewed = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/cases/${caseSlug}/evidence/${evidence.id}/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewed: !reviewed, note })
      })

      if (res.ok) {
        const newReviewedState = !reviewed
        setReviewed(newReviewedState)
        if (newReviewedState) {
          Analytics.evidenceReviewed(caseSlug, evidence.title)
        }
      }
    } catch (err) {
      console.error('Failed to mark evidence:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNote = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/cases/${caseSlug}/evidence/${evidence.id}/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewed, note })
      })

      if (res.ok) {
        setShowNoteInput(false)
      }
    } catch (err) {
      console.error('Failed to save note:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      id={`evidence-${index + 1}`}
      className={`bg-zinc-900 border rounded-lg overflow-hidden transition-all ${
        reviewed ? 'border-green-800/50' : 'border-zinc-800'
      }`}
    >
      {/* Evidence Header */}
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {reviewed && (
            <div className="w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div>
            <span className="text-xs font-mono text-zinc-500">EVIDENCE #{String(index + 1).padStart(2, '0')}</span>
            <h3 className="text-lg font-semibold">{evidence.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded capitalize ${
            evidence.type === 'document' ? 'bg-blue-900/30 text-blue-400 border border-blue-800' :
            evidence.type === 'transcript' ? 'bg-purple-900/30 text-purple-400 border border-purple-800' :
            evidence.type === 'report' ? 'bg-amber-900/30 text-amber-400 border border-amber-800' :
            evidence.type === 'image' ? 'bg-green-900/30 text-green-400 border border-green-800' :
            'bg-zinc-800 text-zinc-400'
          }`}>
            {evidence.type}
          </span>
        </div>
      </div>

      {/* Evidence Content */}
      <div className="p-6">
        {evidence.image_url ? (
          <img
            src={evidence.image_url}
            alt={evidence.title}
            className="max-w-full rounded border border-zinc-800"
          />
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-300 bg-zinc-950 p-4 rounded border border-zinc-800 max-h-96 overflow-y-auto">
            {evidence.content}
          </pre>
        )}
      </div>

      {/* Note Display */}
      {note && !showNoteInput && (
        <div className="px-6 pb-4">
          <div className="bg-amber-900/20 border border-amber-800/50 rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-xs font-medium text-amber-400">Your Notes</span>
            </div>
            <p className="text-sm text-zinc-300">{note}</p>
          </div>
        </div>
      )}

      {/* Note Input */}
      {showNoteInput && (
        <div className="px-6 pb-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add your investigative notes..."
            className="w-full h-24 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowNoteInput(false)}
              className="px-3 py-1 text-sm text-zinc-400 hover:text-zinc-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              disabled={isSaving}
              className="px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
        <button
          onClick={handleMarkReviewed}
          disabled={isSaving}
          className={`flex items-center gap-2 text-sm transition disabled:opacity-50 ${
            reviewed
              ? 'text-green-400 hover:text-green-300'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {reviewed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          {reviewed ? 'Reviewed' : 'Mark as Reviewed'}
        </button>

        <button
          onClick={() => setShowNoteInput(!showNoteInput)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {note ? 'Edit Note' : 'Add Note'}
        </button>
      </div>
    </div>
  )
}
