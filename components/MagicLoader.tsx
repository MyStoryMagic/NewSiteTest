'use client'
import { useState, useEffect } from 'react'

const MAGIC_MESSAGES = [
  "Sprinkling story dust...",
  "Waving the magic wand...",
  "Adding sparkles...",
  "Brewing the magic...",
  "Gathering starlight...",
  "Whispers becoming words...",
]

export default function MagicLoader({ isVisible }: { isVisible: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setProgress(0)
      setMessageIndex(0)
      return
    }

    // Rotate messages
    const messageInterval = setInterval(() => {
      setMessageIndex(i => (i + 1) % MAGIC_MESSAGES.length)
    }, 2500)

    // Animate progress (fake progress that slows down)
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p < 70) return p + 3
        if (p < 85) return p + 1
        if (p < 95) return p + 0.3
        return p
      })
    }, 200)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-purple-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center px-8">
        {/* Magic Wand */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Wand */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
            🪄
          </div>
          
          {/* Sparkles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-ping"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {['✨', '⭐', '🌟', '💫'][i % 4]}
            </div>
          ))}
        </div>

        {/* Message */}
        <h2 className="text-white text-2xl font-display mb-2 transition-all duration-500">
          {MAGIC_MESSAGES[messageIndex]}
        </h2>
        <p className="text-purple-200 mb-6">Creating your magical audio</p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto bg-purple-800/50 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
        <p className="text-purple-300 text-sm mt-2">{Math.round(progress)}% complete</p>

        {/* Floating stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-300 animate-float opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${10 + Math.random() * 20}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              ✦
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}