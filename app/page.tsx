'use client'
import { useRouter } from 'next/navigation'
import { Sparkles } from '@/components/MagicUI'

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-magic-gradient overflow-hidden">
      <Sparkles count={20} />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl">✨</span>
          <span className="text-white font-display text-xl">My Story Magic</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 text-purple-200 hover:text-white transition"
          >
            Log In
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-20 text-center">
        <div className="text-6xl mb-6 animate-bounce">🌙</div>
        <h1 className="text-4xl md:text-6xl font-display text-white mb-6 leading-tight">
          Bedtime Stories<br />
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            In Your Voice
          </span>
        </h1>
        <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
          Personalised AI stories starring your child, narrated in Mum's, Dad's, 
          or Grandma's voice. Be there for bedtime, even when you can't be there.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/signup')}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white text-lg font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/30"
          >
            ✨ Start Free - 3 Stories
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white/10 rounded-2xl text-white text-lg font-semibold hover:bg-white/20 transition"
          >
            See How It Works
          </button>
        </div>
        <p className="text-purple-400 text-sm mt-4">No credit card required</p>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 bg-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-purple-300">Trusted by families across Australia 🇦🇺</p>
          <div className="flex justify-center gap-8 mt-4">
            <div className="text-center">
              <div className="text-3xl font-display text-white">500+</div>
              <div className="text-purple-400 text-sm">Stories Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display text-white">4.9★</div>
              <div className="text-purple-400 text-sm">Parent Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display text-white">3min</div>
              <div className="text-purple-400 text-sm">To First Story</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-display text-white text-center mb-12">
          Magic in 3 Simple Steps
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">👶</div>
            <h3 className="text-white font-display text-xl mb-2">1. Add Your Child</h3>
            <p className="text-purple-300 text-sm">
              Tell us their name, age, and interests. Each story stars them as the hero!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-white font-display text-xl mb-2">2. Record Your Voice</h3>
            <p className="text-purple-300 text-sm">
              3 minutes is all it takes. Our AI learns your warmth, tone, and love.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-white font-display text-xl mb-2">3. Generate Stories</h3>
            <p className="text-purple-300 text-sm">
              One tap creates a unique bedtime adventure, narrated in your voice.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative z-10 bg-white/5 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-display text-white text-center mb-12">
            Perfect For...
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 flex gap-4">
              <div className="text-3xl">✈️</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Travelling Parents</h3>
                <p className="text-purple-300 text-sm">Business trip? Your voice is still there for bedtime.</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 flex gap-4">
              <div className="text-3xl">👨‍👩‍👧</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Separated Families</h3>
                <p className="text-purple-300 text-sm">Both parents can be part of bedtime, every night.</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 flex gap-4">
              <div className="text-3xl">👵</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Grandparents Far Away</h3>
                <p className="text-purple-300 text-sm">Nanna's voice from across the country or world.</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 flex gap-4">
              <div className="text-3xl">🏥</div>
              <div>
                <h3 className="text-white font-semibold mb-1">FIFO & Shift Workers</h3>
                <p className="text-purple-300 text-sm">Working nights? Still be there for bedtime stories.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-display text-white text-center mb-4">
          Simple, Family-Friendly Pricing
        </h2>
        <p className="text-purple-300 text-center mb-12">Start free, upgrade when you're ready</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-white font-display text-xl">Free</h3>
              <div className="text-3xl font-bold text-white mt-2">$0</div>
              <p className="text-purple-400 text-sm">forever</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> 3 stories total
              </li>
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> AI narrator voices
              </li>
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> Personalised to your child
              </li>
            </ul>
            <button
              onClick={() => router.push('/signup')}
              className="w-full py-3 bg-white/10 rounded-xl text-white font-semibold hover:bg-white/20 transition"
            >
              Get Started
            </button>
          </div>

          {/* Basic */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-white font-display text-xl">Basic</h3>
              <div className="text-3xl font-bold text-white mt-2">$4.99</div>
              <p className="text-purple-400 text-sm">per month</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> Unlimited stories
              </li>
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> AI narrator voices
              </li>
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> World Builder
              </li>
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> Story Sagas
              </li>
            </ul>
            <button
              onClick={() => router.push('/signup')}
              className="w-full py-3 bg-white/10 rounded-xl text-white font-semibold hover:bg-white/20 transition"
            >
              Start Free Trial
            </button>
          </div>

          {/* Premium */}
          <div className="bg-gradient-to-b from-purple-500/20 to-pink-500/20 backdrop-blur rounded-2xl p-6 border border-purple-400/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs font-semibold">
              MOST POPULAR
            </div>
            <div className="text-center mb-6">
              <h3 className="text-white font-display text-xl">Premium</h3>
              <div className="text-3xl font-bold text-white mt-2">$11.99</div>
              <p className="text-purple-400 text-sm">per month</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="text-purple-200 text-sm flex gap-2">
                <span>💜</span> <strong>Your voice cloning</strong>
              </li>
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> Up to 4 family voices
              </li>
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> Unlimited stories
              </li>
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> 3, 5, or 10 min stories
              </li>
              <li className="text-purple-200 text-sm flex gap-2">
                <span>✓</span> Share stories
              </li>
            </ul>
            <button
              onClick={() => router.push('/signup')}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative z-10 bg-white/5 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="text-4xl mb-6">💜</div>
          <blockquote className="text-xl text-white italic mb-6">
            "My daughter asks for 'Daddy stories' every night now. Even when I'm 
            away for work, she hears my voice. It's become our special thing."
          </blockquote>
          <p className="text-purple-400">— Michael, FIFO worker, Perth</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-display text-white mb-4">
          Ready to Make Bedtime Magic?
        </h2>
        <p className="text-purple-300 mb-8">
          Join hundreds of families creating unforgettable bedtime moments.
        </p>
        <button
          onClick={() => router.push('/signup')}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white text-lg font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/30"
        >
          ✨ Create Your First Story Free
        </button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="text-white font-display">My Story Magic</span>
          </div>
          <div className="flex gap-6 text-purple-400 text-sm">
            <a href="/privacy" className="hover:text-white transition">Privacy</a>
            <a href="/terms" className="hover:text-white transition">Terms</a>
            <a href="mailto:hello@mystorymagic.com" className="hover:text-white transition">Contact</a>
          </div>
          <p className="text-purple-500 text-sm">
            © 2026 Story Magic Pty Ltd
          </p>
        </div>
      </footer>
    </main>
  )
}