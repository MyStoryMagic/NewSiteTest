'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Check if user has children
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data: children } = await supabase
        .from('children')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (children && children.length > 0) {
        // Has profile, go to stories
        router.push('/stories')
      } else {
        // No profile, complete onboarding
        router.push('/setup/details')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/stories`
        }
      })
      if (error) throw error
    } catch (err) {
      setError('Google login failed')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center relative overflow-hidden">
      <Sparkles count={12} />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <SleepyBear mood="waving" size="large" className="mx-auto mb-4" />
          <h1 className="text-4xl font-display text-white mb-2">Welcome Back</h1>
          <p className="text-purple-200">Continue your magical journey</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
          
          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-gray-800 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-purple-200" style={{backgroundColor: 'rgba(30, 27, 75, 1)'}}>
                Or login with email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-purple-200 text-sm mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:border-purple-400 focus:outline-none placeholder:text-purple-300/50"
                required
              />
            </div>

            <div>
              <label className="text-purple-200 text-sm mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:border-purple-400 focus:outline-none placeholder:text-purple-300/50"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-purple-200 text-sm">Don't have an account? </span>
            <button
              onClick={() => router.push('/signup')}
              className="text-purple-300 text-sm underline hover:text-white transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}