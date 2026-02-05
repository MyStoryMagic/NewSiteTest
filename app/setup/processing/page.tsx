'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles } from '@/components/MagicUI'

export default function Processing() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Preparing your voice...')
  const [error, setError] = useState('')

  useEffect(() => {
    processVoice()
  }, [])

  async function processVoice() {
    try {
      const childProfileStr = localStorage.getItem('childProfile')
      const voiceRecording = localStorage.getItem('voiceRecording')

      if (!childProfileStr || !voiceRecording) {
        router.push('/setup/details')
        return
      }

      const childProfile = JSON.parse(childProfileStr)

      // Step 1: Validate (20%)
      setProgress(20)
      setStatus('Validating audio quality...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 2: Upload (40%)
      setProgress(40)
      setStatus('Uploading your voice...')
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Step 3: Create voice clone (60%)
      setProgress(60)
      setStatus('Creating your magic voice...')

      const response = await fetch('/api/clone-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: voiceRecording,
          childName: childProfile.name
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create voice')
      }

      // Step 4: Save voice ID (80%)
      setProgress(80)
      setStatus('Saving your voice...')
      childProfile.voiceId = data.voiceId
      localStorage.setItem('childProfile', JSON.stringify(childProfile))
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 5: Complete (100%)
      setProgress(100)
      setStatus('Magic complete!')
      await new Promise(resolve => setTimeout(resolve, 500))

      router.push('/setup/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (error) {
    return (
      <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center relative overflow-hidden">
        <Sparkles count={6} />
        <div className="max-w-md w-full relative z-10">
          <div className="bg-red-500/20 backdrop-blur-md rounded-2xl border border-red-400/50 p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-display text-white mb-3">Oops! Something went wrong</h2>
            <p className="text-purple-200 mb-6">{error}</p>
            <button
              onClick={() => router.push('/setup/record-voice')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-bold hover:scale-105 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center relative overflow-hidden">
      <Sparkles count={12} />
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-8">
          
          {/* Sleepy Bear - animated based on progress */}
          <div className="mb-6">
            <SleepyBear 
              mood={progress < 50 ? "waking" : progress < 100 ? "excited" : "happy"} 
              size="hero" 
              className="mx-auto" 
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-display text-white text-center mb-2">
            Creating Your Magic Voice
          </h1>
          <p className="text-purple-200 text-center mb-8">{status}</p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-purple-300 text-sm mt-2">{progress}%</p>
          </div>

          {/* Fun messages */}
          <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-400/30">
            <p className="text-purple-100 text-sm text-center">
              {progress < 30 && "✨ Analyzing your unique voice..."}
              {progress >= 30 && progress < 60 && "🎨 Painting your voice with magic..."}
              {progress >= 60 && progress < 90 && "🌟 Almost there! Sprinkling stardust..."}
              {progress >= 90 && "🎉 Your magic voice is ready!"}
            </p>
          </div>

        </div>

        {/* Warning: Don't close */}
        <p className="text-center text-purple-300 text-xs mt-4">
          Please do not close this window
        </p>
      </div>
    </main>
  )
}