'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

export default function UpgradeSuccessPage() {
  const router = useRouter()
  const [tier, setTier] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSubscription()
  }, [])

  async function checkSubscription() {
    // Give Stripe webhook a moment to process
    await new Promise(resolve => setTimeout(resolve, 2000))

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signup')
      return
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .single()

    if (sub) {
      setTier(sub.tier)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center">
        <Sparkles count={20} />
        <div className="text-center relative z-10">
          <div className="text-6xl mb-4 animate-bounce">✨</div>
          <h1 className="text-2xl font-display text-white">Processing your upgrade...</h1>
          <p className="text-purple-200 mt-2">Just a moment...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center">
      <Sparkles count={25} />
      
      <div className="max-w-md w-full relative z-10 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
          <SleepyBear mood="happy" size="large" className="mx-auto mb-4" />
          
          <div className="text-6xl mb-4">🎉</div>
          
          <h1 className="text-3xl font-display text-white mb-2">
            Welcome to {tier === 'premium' ? 'Premium' : 'Basic'}!
          </h1>
          
          <p className="text-purple-200 mb-6">
            {tier === 'premium' 
              ? "You now have access to family voice cloning and all premium features!"
              : "You now have unlimited stories for your little ones!"}
          </p>

          {tier === 'premium' && (
            <div className="bg-purple-500/20 rounded-xl p-4 mb-6 text-left">
              <p className="text-white font-semibold mb-2">🎤 Ready to clone your voice?</p>
              <p className="text-purple-200 text-sm">
                Head to Settings to record your voice and create magical bedtime stories in your own voice!
              </p>
            </div>
          )}

          <div className="space-y-3">
            {tier === 'premium' && (
              <Link
                href="/settings"
                className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:opacity-90 transition"
              >
                🎤 Record My Voice
              </Link>
            )}
            
            <Link
              href="/stories"
              className="block w-full py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition"
            >
              ✨ Create a Story
            </Link>
          </div>
        </div>

        <p className="text-purple-300 text-sm mt-6">
          Thank you for supporting My Story Magic! 💜
        </p>
      </div>
    </main>
  )
}
