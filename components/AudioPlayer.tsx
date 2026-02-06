'use client'

import { useState, useRef, useEffect } from 'react'

interface AudioPlayerProps {
  src: string
  title?: string
  className?: string
}

export default function AudioPlayer({ src, title, className = '' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      setError('Failed to load audio')
      setIsLoading(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <div className={`bg-zinc-950 border border-red-800/50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3 text-red-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-lg p-4 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Waveform visualization placeholder */}
      <div className="mb-4 h-16 bg-zinc-900 rounded flex items-center justify-center overflow-hidden relative">
        {/* Animated waveform bars */}
        <div className="flex items-center gap-0.5 h-full px-2">
          {[...Array(50)].map((_, i) => {
            const height = Math.sin(i * 0.3) * 30 + 40 + Math.random() * 10
            const isActive = duration > 0 && (i / 50) <= (currentTime / duration)
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-100 ${
                  isActive ? 'bg-amber-500' : 'bg-zinc-700'
                } ${isPlaying && isActive ? 'animate-pulse' : ''}`}
                style={{ height: `${height}%` }}
              />
            )
          })}
        </div>

        {/* Recording label */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-xs font-mono text-zinc-500">
            {isPlaying ? 'PLAYING' : 'AUDIO EVIDENCE'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 flex items-center justify-center transition-colors"
        >
          {isLoading ? (
            <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : isPlaying ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Progress */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            disabled={isLoading}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-amber-500
              [&::-webkit-slider-thumb]:hover:bg-amber-400
              [&::-webkit-slider-thumb]:transition-colors"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs font-mono text-zinc-500">{formatTime(currentTime)}</span>
            <span className="text-xs font-mono text-zinc-500">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      {title && (
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <p className="text-sm text-zinc-400 font-mono">{title}</p>
        </div>
      )}
    </div>
  )
}
