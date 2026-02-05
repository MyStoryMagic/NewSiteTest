'use client'
import { useState } from 'react'
import Link from 'next/link'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault()
    
    if (!acceptedTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue')
      return
    }
    
    setLoading(true)
    setError('')
    
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      window.location.href = '/setup/details'
    }
    setLoading(false)
  }

  async function handleGoogleSignup() {
    if (!acceptedTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue')
      return
    }
    
    console.log('Google clicked')
    setLoading(true)
    setError('')
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/setup/details'
      }
    })
    console.log('Response:', error)
    if (error) setError(error.message)
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center">
      <Sparkles count={12} />
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <SleepyBear mood="waving" size="large" className="mx-auto mb-4" />
          <h1 className="text-4xl font-display text-white mb-2">Create Account</h1>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
          
          {/* Terms Acceptance Checkbox */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked)
                    if (e.target.checked) setError('')
                  }}
                  className="sr-only peer"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  acceptedTerms 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400' 
                    : 'bg-white/10 border-purple-400/50 group-hover:border-purple-400'
                }`}>
                  {acceptedTerms && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-purple-200 text-sm leading-tight">
                I agree to the{' '}
                <Link href="/terms" className="text-purple-300 underline hover:text-white">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-purple-300 underline hover:text-white">
                  Privacy Policy
                </Link>
                , including reviewing all stories before playback to children.
              </span>
            </label>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className={`w-full bg-white text-gray-800 py-3 rounded-xl font-semibold mb-6 transition ${
              !acceptedTerms ? 'opacity-60' : 'hover:bg-gray-100'
            }`}
          >
            Continue with Google
          </button>

          <div className="text-center text-purple-200 text-sm mb-6">Or with email</div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/10 focus:border-purple-400 focus:outline-none placeholder:text-purple-300/50"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/10 focus:border-purple-400 focus:outline-none placeholder:text-purple-300/50"
              required
              minLength={6}
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold transition ${
                !acceptedTerms ? 'opacity-60' : 'hover:opacity-90'
              }`}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <p className="text-purple-300 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-white underline hover:text-purple-200">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
