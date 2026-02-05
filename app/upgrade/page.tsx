'use client' 
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try the magic',
    features: [
      '3 stories total',
      'AI narrator voices',
      '3 minute stories',
    ],
    notIncluded: [
      'Unlimited stories',
      'Family voice cloning',
      'Longer stories (5-10 min)',
    ],
    cta: 'Current Plan',
    popular: false
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$4.99',
    period: '/month',
    description: 'Unlimited bedtime magic',
    features: [
      'Unlimited stories',
      'AI narrator voices',
      '3 minute stories',
      'Story library',
      'Download MP3s',
    ],
    notIncluded: [
      'Family voice cloning',
      'Longer stories (5-10 min)',
    ],
    cta: 'Upgrade to Basic',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$11.99',
    period: '/month',
    description: 'The full family experience',
    features: [
      'Everything in Basic',
      '🎤 Clone up to 4 family voices',
      '20 voice stories/month',
      '3, 5, and 10 minute stories',
      'Priority support',
    ],
    notIncluded: [],
    cta: 'Upgrade to Premium',
    popular: true
  }
]

export default function UpgradePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentTier, setCurrentTier] = useState('free')
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signup')
      return
    }
    setUser(user)

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .single()

    if (sub) {
      setCurrentTier(sub.tier || 'free')
    }
  }

  async function handleUpgrade(tier: string) {
    if (tier === 'free' || tier === currentTier) return

    setLoading(tier)

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          tier
        })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to start checkout')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  function getButtonText(plan: typeof PLANS[0]) {
    if (plan.id === currentTier) return '✓ Current Plan'
    if (plan.id === 'free') return 'Free Plan'
    if (currentTier === 'premium' && plan.id === 'basic') return 'Downgrade'
    return plan.cta
  }

  function isButtonDisabled(plan: typeof PLANS[0]) {
    return plan.id === currentTier || plan.id === 'free' || (currentTier === 'premium' && plan.id === 'basic')
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6">
      <Sparkles count={15} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/stories" className="inline-block mb-4">
            <span className="text-purple-300 hover:text-white">← Back to Stories</span>
          </Link>
          <SleepyBear mood="happy" size="large" className="mx-auto mb-4" />
          <h1 className="text-4xl font-display text-white mb-2">Choose Your Magic</h1>
          <p className="text-purple-200">Unlock the full bedtime story experience</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative bg-white/10 backdrop-blur-md rounded-2xl border p-6 ${
                plan.popular 
                  ? 'border-pink-400 ring-2 ring-pink-400/50' 
                  : 'border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="text-2xl font-display text-white mb-1">{plan.name}</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-purple-300">{plan.period}</span>
                </div>
                <p className="text-purple-300 text-sm mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2 text-purple-100">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map(feature => (
                  <li key={feature} className="flex items-start gap-2 text-purple-400/60">
                    <span className="mt-0.5">✗</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isButtonDisabled(plan) || loading === plan.id}
                className={`w-full py-3 rounded-xl font-bold transition ${
                  plan.id === currentTier
                    ? 'bg-white/20 text-purple-300 cursor-default'
                    : plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? 'Loading...' : getButtonText(plan)}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
          <h3 className="text-xl font-display text-white mb-4">Common Questions</h3>
          <div className="space-y-4 text-purple-200">
            <div>
              <p className="font-semibold text-white">Can I cancel anytime?</p>
              <p className="text-sm">Yes! Cancel anytime from your account settings. No questions asked.</p>
            </div>
            <div>
              <p className="font-semibold text-white">What payment methods do you accept?</p>
              <p className="text-sm">All major credit cards, Apple Pay, and Google Pay.</p>
            </div>
            <div>
              <p className="font-semibold text-white">What happens to my stories if I downgrade?</p>
              <p className="text-sm">Your story library is always saved. You just won't be able to create new ones beyond the free limit.</p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 text-center text-purple-300 text-sm">
          <p>🔒 Secure payment via Stripe • Cancel anytime • 100% satisfaction guarantee</p>
        </div>
      </div>
    </main>
  )
}
