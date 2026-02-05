'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles, MagicButton } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

export default function FirstStory() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [child, setChild] = useState<any>(null)
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)

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

  async function generateStory() {
    if (!child) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: child.name,
          childAge: child.age,
          interests: child.interests,
          storyLength: '5min'
        })
      })

      const data = await response.json()
      
      if (data.story) {
        setStory(data.story)
        
        // Save story to Supabase
        await supabase
          .from('stories')
          .insert({
            user_id: user.id,
            child_id: child.id,
            content: data.story,
            theme: 'onboarding'
          })
      } else {
        alert('Error generating story')
      }
    } catch (error) {
      alert('Failed to generate story')
    } finally {
      setLoading(false)
    }
  }

  if (!child) return null

  return (
    <main className="min-h-screen bg-magic-gradient p-6 relative overflow-hidden">
      <Sparkles count={10} />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <SleepyBear mood={story ? "excited" : "waking"} size="small" />
        <div>
          <p className="text-purple-200 text-sm">
            {story ? "Story ready!" : "Creating magic..."}
          </p>
          <h1 className="text-white text-2xl font-display">First Story</h1>
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-center gap-2 text-sm text-purple-200 mb-2">
          <span className="font-semibold">Step 2 of 3</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '66%'}}></div>
        </div>
      </div>

      {!story && !loading && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center relative z-10 max-w-2xl mx-auto">
          <SleepyBear mood="reading" size="large" className="mx-auto mb-4" />
          <h2 className="text-2xl font-display text-white mb-4">Ready for a story</h2>
          <MagicButton onClick={generateStory}>Generate Story</MagicButton>
        </div>
      )}

      {loading && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center relative z-10 max-w-2xl mx-auto">
          <SleepyBear mood="excited" size="large" className="mx-auto mb-6" />
          <p className="text-white text-xl">Creating magic...</p>
        </div>
      )}

      {story && (
        <div className="space-y-4 relative z-10 max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-white text-xl mb-4 font-display">Your Story</h2>
            <div className="text-purple-100 space-y-3 max-h-96 overflow-y-auto">
              {story.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-500/10 backdrop-blur-md rounded-2xl border border-yellow-400/30 p-6">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🎤</span>
              <div>
                <h3 className="font-display text-lg text-white mb-2">Capture YOUR voice</h3>
                <p className="text-purple-200 text-sm">Read this story aloud while we record</p>
              </div>
            </div>
          </div>

          <MagicButton onClick={() => router.push('/setup/record-voice')}>
            Continue to Recording
          </MagicButton>
        </div>
      )}
    </main>
  )
}