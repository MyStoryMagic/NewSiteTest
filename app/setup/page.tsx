'use client'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles, MagicButton } from '@/components/MagicUI'

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center relative overflow-hidden">
      <Sparkles count={20} />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        <div className="mb-8">
          <SleepyBear mood="happy" size="hero" className="mx-auto mb-6" />
        </div>

        <h1 className="text-6xl md:text-7xl font-display text-white mb-6 leading-tight">
          My Story Magic
        </h1>

        <p className="text-2xl md:text-3xl text-purple-200 mb-4 font-light">
          Where bedtime stories come to life
        </p>

        <p className="text-xl text-purple-300 mb-12">
          in your own voice
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-display text-white mb-6">
            ✨ Personalized AI bedtime stories
          </h2>
          
          <div className="space-y-4 text-left text-purple-100">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Unlimited Stories</h3>
                <p className="text-sm">New adventures every night, personalized for your child</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎤</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Your Voice</h3>
                <p className="text-sm">Clone your voice once, use it in every story forever</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">💜</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Always There</h3>
                <p className="text-sm">Even when traveling or working late, your voice tucks them in</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <MagicButton onClick={() => router.push('/signup')}>
            Start Free Trial
          </MagicButton>
          
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 rounded-full font-semibold bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 transition-all"
          >
            Log In
          </button>
        </div>

        <p className="text-purple-300 text-sm">
          🎁 Start with 3 free stories • No credit card required
        </p>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-purple-400 text-sm mb-2">Coming soon to Australia</p>
          <p className="text-purple-500 text-xs">Launching Q1 2025</p>
        </div>

      </div>
    </main>
  )
}