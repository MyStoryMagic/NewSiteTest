'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles, MagicButton } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

const AGE_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10]

const INTEREST_OPTIONS = [
  'Animals 🐾', 'Space 🚀', 'Dragons 🐉', 'Princesses 👑',
  'Pirates 🏴‍☠️', 'Dinosaurs 🦕', 'Magic ✨', 'Sports ⚽',
  'Robots 🤖', 'Fairies 🧚'
]

export default function ChildDetails() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [existingChildren, setExistingChildren] = useState<any[]>([])
  const [showNewChildForm, setShowNewChildForm] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState(5)
  const [interests, setInterests] = useState<string[]>([])
  const [customInterest, setCustomInterest] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/signup')
      return
    }
    setUser(user)

    const { data: children } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (children && children.length > 0) {
      setExistingChildren(children)
    } else {
      setShowNewChildForm(true)
    }
  }

  function selectChild(childId: string) {
    localStorage.setItem('currentChildId', childId)
    router.push('/stories')
  }

  function toggleInterest(interest: string) {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  function addCustomInterest() {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()])
      setCustomInterest('')
    }
  }

  async function handleCreateChild() {
    if (!name || interests.length === 0 || !user) return

    setLoading(true)

    try {
      const { data: child, error } = await supabase
        .from('children')
        .insert({
          user_id: user.id,
          name,
          age,
          interests
        })
        .select()
        .single()

      if (error) throw error

      if (existingChildren.length === 0) {
        await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            tier: 'free'
          })
      }

      localStorage.setItem('currentChildId', child.id)
      
      // Go straight to stories - they can create their first story there!
      router.push('/stories')
    } catch (error) {
      console.error('Error creating child:', error)
      alert('Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  if (existingChildren.length > 0 && !showNewChildForm) {
    return (
      <main className="min-h-screen bg-magic-gradient p-6 relative overflow-hidden">
        <Sparkles count={15} />

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <SleepyBear mood="happy" size="small" />
          <div>
            <h1 className="text-white text-2xl font-display">Select a Child</h1>
            <p className="text-purple-200 text-sm">Or create a new profile</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          {existingChildren.map(child => (
            <div
              key={child.id}
              onClick={() => selectChild(child.id)}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/20 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-white mb-2">{child.name}</h2>
                  <p className="text-purple-200 text-sm">Age {child.age}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {child.interests.slice(0, 3).map((interest: string, i: number) => (
                      <span key={i} className="text-purple-300 text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                    {child.interests.length > 3 && (
                      <span className="text-purple-300 text-xs">+{child.interests.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="text-4xl">{child.voice_id ? '🎤' : '✨'}</div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowNewChildForm(true)}
            className="w-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/20 transition-all text-center"
          >
            <div className="text-4xl mb-2">➕</div>
            <div className="text-white font-display text-lg">Add Another Child</div>
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6 relative overflow-hidden">
      <Sparkles count={15} />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <SleepyBear mood="waking" size="small" />
        <div>
          <p className="text-purple-200 text-sm">Sleepy Bear is waking up!</p>
          <h1 className="text-white text-2xl font-display">Tell us about your child</h1>
        </div>
      </div>

      {existingChildren.length > 0 && (
        <button
          onClick={() => setShowNewChildForm(false)}
          className="mb-6 text-purple-300 text-sm underline hover:text-white relative z-10"
        >
          ← Back to child list
        </button>
      )}

      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-8 relative z-10">
        
        <div className="mb-6">
          <label className="text-purple-200 text-sm font-medium mb-2 block">
            Child's Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:border-purple-400 focus:outline-none placeholder:text-purple-300/50"
            required
          />
        </div>

        <div className="mb-6">
          <label className="text-purple-200 text-sm font-medium mb-3 block">
            Age
          </label>
          <div className="flex gap-3 flex-wrap">
            {AGE_OPTIONS.map(ageOption => (
              <button
                key={ageOption}
                onClick={() => setAge(ageOption)}
                className={`w-12 h-12 rounded-full font-bold transition-all ${
                  age === ageOption
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {ageOption}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-purple-200 text-sm font-medium mb-3 block">
            Interests (select at least one)
          </label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {INTEREST_OPTIONS.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all text-left ${
                  interests.includes(interest)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
              placeholder="Add custom interest"
              className="flex-1 bg-white/10 text-white rounded-xl px-4 py-2 border border-white/20 focus:border-purple-400 focus:outline-none placeholder:text-purple-300/50"
            />
            <button
              onClick={addCustomInterest}
              className="bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30"
            >
              Add
            </button>
          </div>
        </div>

        {interests.length > 0 && (
          <div className="mb-6">
            <p className="text-purple-200 text-sm mb-2">Selected interests:</p>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <span
                  key={interest}
                  className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-3 py-1 rounded-full text-sm border border-purple-400/30"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        <MagicButton
          onClick={handleCreateChild}
          disabled={!name || interests.length === 0 || loading}
        >
          {loading ? 'Creating Profile...' : '✨ Start Creating Stories'}
        </MagicButton>
      </div>
    </main>
  )
}
