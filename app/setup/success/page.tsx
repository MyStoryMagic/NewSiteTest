'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles, MagicButton } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

export default function Success() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [child, setChild] = useState<any>(null)

  useEffect(() => {
    loadChildProfile()
  }, [])

  async function loadChildProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signup')
      return
    }
    setUser(user)

    const childId = localStorage.getItem('currentChildId')
    if (!childId) {
      router.push('/setup/details')
      return
    }

    const { data: childData } = await supabase
      .from('children')
      .select('*')
      .eq('id', childId)
      .single()

    if (!childData) {
      router.push('/setup/details')
      return
    }

    setChild(childData)
  }

  if (!child) return null

  return (
    <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center relative overflow-hidden">
      <Sparkles count={20} />
      
      <div className="max-w-md w-full relative z-10">
        
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce-soft">🎉</div>
          <h1 className="text-4xl font-display text-white mb-2">
            Magic Voice Created!
          </h1>
          <p className="text-purple-200 text-lg">
            Your storytelling voice is now preserved forever
          </p>
        </div>

        <div className="mb-8">
          <SleepyBear mood="happy" size="hero" className="mx-auto" />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
          <h2 className="font-display text-xl text-white mb-4 text-center">
            What happens now?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl">📚</span>
              <div>
                <h3 className="font-bold text-white mb-1">Unlimited Stories</h3>
                <p className="text-purple-200 text-sm">Generate personalized bedtime stories anytime</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-3xl">🎤</span>
              <div>
                <h3 className="font-bold text-white mb-1">Your Voice</h3>
                <p className="text-purple-200 text-sm">Every story narrated in YOUR voice - like you are always there</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-3xl">✨</span>
              <div>
                <h3 className="font-bold text-white mb-1">Pure Magic</h3>
                <p className="text-purple-200 text-sm">Whether you are home, traveling, or miles away - your voice tucks them in</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl border border-purple-400/30 p-6 mb-6">
          <p className="text-purple-100 text-center leading-relaxed">
            You just gave {child.name} a gift they will treasure forever. Every bedtime story will be narrated in YOUR voice - a piece of you, always with them.
          </p>
        </div>

        <MagicButton onClick={() => router.push('/stories')}>
          Create Your First Story! 🚀
        </MagicButton>

        <div className="mt-6 bg-yellow-500/10 backdrop-blur-sm rounded-xl border border-yellow-400/30 p-4">
          <p className="text-purple-200 text-sm text-center">
            💡 <strong>Pro Tip:</strong> Bookmark this page on your phone for quick bedtime access!
          </p>
        </div>

      </div>
    </main>
  )
}