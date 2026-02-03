'use client'

import { useState } from 'react'

interface ProfileFormProps {
  userId: string
  email: string
  initialDisplayName: string
}

export default function ProfileForm({
  userId,
  email,
  initialDisplayName,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update profile',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-500 cursor-not-allowed"
          />
          <p className="text-xs text-zinc-600 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-zinc-400 mb-1">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Agent Smith"
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500"
          />
          <p className="text-xs text-zinc-600 mt-1">Shown on your profile and in the dashboard</p>
        </div>

        {message && (
          <div
            className={`px-4 py-2 rounded text-sm ${
              message.type === 'success'
                ? 'bg-green-900/30 border border-green-800 text-green-400'
                : 'bg-red-900/30 border border-red-800 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded transition"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
