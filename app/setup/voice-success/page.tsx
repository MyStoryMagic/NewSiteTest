'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

export default function VoiceSuccessPage() {
  const router = useRouter()
  const [childName, setChildName] = useState('')

  useEffect(() => {
    loadChild()
  }, [])

  async function loadChild() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signup')
      return
    }

    const { data: children } = await supabase
      .from('children')
      .select('name')
      .eq('user_id', user.id)
      .limit(1)

    if (children && children.length > 0) {
      setChildName(children[0].name)
    }
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center">
      <Sparkles count={25} />

      <div className="max-w-md mx-auto text-center relative z-10">
        {/* Celebration Animation */}
        <div className="relative mb-6">
          <div className="text-7xl animate-bounce">🎉</div>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
              }}
            >
              {['✨', '⭐', '🌟', '💜', '🎤'][i % 5]}
            </div>
          ))}
        </div>

        <SleepyBear mood="excited" size="large" />
        
        <h1 className="text-white text-3xl font-display mt-6 mb-4">
          Your Voice is Ready!
        </h1>
        
        <p className="text-purple-200 mb-4">
          Amazing! We've learned your voice perfectly.
        </p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-8 border border-white/10">
          <p className="text-purple-100">
            Now when you create stories for <span className="text-white font-semibold">{childName || 'your child'}</span>, 
            you can choose <span className="text-pink-400 font-semibold">"Your Voice"</span> and 
            it will sound just like you reading to them — even when you're not there! 💜
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/stories')}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white text-lg hover:opacity-90 transition"
          >
            ✨ Create a Story in My Voice
          </button>
          
          <button
            onClick={() => router.push('/worlds')}
            className="w-full py-3 bg-white/10 rounded-xl font-semibold text-purple-200 hover:bg-white/20 transition"
          >
            🌍 Explore World Builder
          </button>
        </div>

        <p className="text-purple-400 text-sm mt-8">
          You can re-record your voice anytime in Settings
        </p>
      </div>
    </main>
  )
}