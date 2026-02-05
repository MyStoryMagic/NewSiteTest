'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [children, setChildren] = useState<any[]>([])
  const [familyVoices, setFamilyVoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()
    setSubscription(sub)

    const { data: childrenData } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    setChildren(childrenData || [])

    const { data: voices } = await supabase
      .from('voice_clones')
      .select('*')
      .eq('user_id', user.id)
    setFamilyVoices(voices || [])

    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function deleteVoice(voiceId: string, voiceName: string) {
    if (!confirm(`Delete ${voiceName}'s voice? This cannot be undone.`)) return

    await supabase
      .from('voice_clones')
      .delete()
      .eq('id', voiceId)

    setFamilyVoices(familyVoices.filter(v => v.id !== voiceId))
  }

  async function deleteChild(childId: string, childName: string) {
    if (!confirm(`Delete ${childName}'s profile and all their stories? This cannot be undone.`)) return

    // Delete stories first
    await supabase
      .from('stories')
      .delete()
      .eq('child_id', childId)

    // Delete child
    await supabase
      .from('children')
      .delete()
      .eq('id', childId)

    setChildren(children.filter(c => c.id !== childId))
  }

  async function deleteAccount() {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    // Delete all user data
    await supabase.from('stories').delete().eq('user_id', user.id)
    await supabase.from('voice_clones').delete().eq('user_id', user.id)
    await supabase.from('children').delete().eq('user_id', user.id)
    await supabase.from('sagas').delete().eq('user_id', user.id)
    await supabase.from('worlds').delete().eq('user_id', user.id)
    await supabase.from('subscriptions').delete().eq('user_id', user.id)
    
    await supabase.auth.signOut()
    router.push('/')
  }

  const tierLabels: Record<string, string> = {
    free: '🌟 Free',
    basic: '✨ Basic',
    premium: '⭐ Premium'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6">
      <Sparkles count={8} />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/stories')}
                className="text-purple-300 hover:text-white"
              >
                ←
              </button>
              <SleepyBear mood="happy" size="small" />
              <div>
                <h1 className="text-white text-2xl font-display">Settings</h1>
                <p className="text-purple-200 text-sm">Manage your account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
          <h2 className="text-white font-display text-lg mb-4">Account</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-purple-300">Email</span>
              <span className="text-white">{user?.email}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-purple-300">Plan</span>
              <span className="text-white">{tierLabels[subscription?.tier || 'free']}</span>
            </div>

            {subscription?.tier !== 'premium' && (
              <button
                onClick={() => router.push('/upgrade')}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold"
              >
                ⬆️ Upgrade to {subscription?.tier === 'basic' ? 'Premium' : 'Basic or Premium'}
              </button>
            )}
          </div>
        </div>

        {/* Children Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-display text-lg">Children</h2>
            <button
              onClick={() => router.push('/setup/details')}
              className="text-purple-300 hover:text-white text-sm"
            >
              + Add Child
            </button>
          </div>

          {children.length === 0 ? (
            <p className="text-purple-400 text-sm">No children added yet.</p>
          ) : (
            <div className="space-y-3">
              {children.map(child => (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                >
                  <div>
                    <div className="text-white font-semibold">{child.name}</div>
                    <div className="text-purple-400 text-sm">
                      {child.age} years old • {child.interests?.join(', ')}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteChild(child.id, child.name)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Family Voices Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-display text-lg">Family Voices</h2>
            {subscription?.tier === 'premium' && familyVoices.length < 4 && (
              <button
                onClick={() => router.push('/setup/record-voice')}
                className="text-purple-300 hover:text-white text-sm"
              >
                + Add Voice
              </button>
            )}
          </div>

          {subscription?.tier !== 'premium' ? (
            <div className="text-center py-4">
              <p className="text-purple-400 text-sm mb-3">Voice cloning is a Premium feature</p>
              <button
                onClick={() => router.push('/upgrade')}
                className="px-4 py-2 bg-white/10 rounded-xl text-purple-200 hover:bg-white/20 transition"
              >
                🔒 Upgrade to Premium
              </button>
            </div>
          ) : familyVoices.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-purple-400 text-sm mb-3">No voices recorded yet</p>
              <button
                onClick={() => router.push('/setup/record-voice')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white"
              >
                🎤 Record First Voice
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {familyVoices.map(voice => (
                <div
                  key={voice.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{voice.emoji}</span>
                    <div>
                      <div className="text-white font-semibold">{voice.name}</div>
                      <div className="text-purple-400 text-sm">{voice.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteVoice(voice.id, voice.name)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {familyVoices.length < 4 && (
                <button
                  onClick={() => router.push('/setup/record-voice')}
                  className="w-full p-3 bg-white/5 rounded-xl text-purple-300 border border-dashed border-purple-400/50 hover:bg-white/10 transition"
                >
                  + Add Another Voice ({4 - familyVoices.length} remaining)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Worlds Section */}
        {(subscription?.tier === 'basic' || subscription?.tier === 'premium') && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-display text-lg">Story Worlds</h2>
              <button
                onClick={() => router.push('/worlds')}
                className="text-purple-300 hover:text-white text-sm"
              >
                Manage →
              </button>
            </div>
            <p className="text-purple-400 text-sm">
              Create magical worlds with recurring characters and multi-episode sagas.
            </p>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-red-500/10 backdrop-blur-md rounded-2xl border border-red-500/20 p-6">
          <h2 className="text-red-400 font-display text-lg mb-4">Danger Zone</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
            >
              Log Out
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 bg-red-500/20 rounded-xl text-red-400 hover:bg-red-500/30 transition"
              >
                Delete Account
              </button>
            ) : (
              <div className="p-4 bg-red-500/20 rounded-xl">
                <p className="text-red-300 text-sm mb-3">
                  ⚠️ This will permanently delete your account, all children profiles, 
                  stories, voice clones, and worlds. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2 bg-white/10 rounded-xl text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteAccount}
                    className="flex-1 py-2 bg-red-500 rounded-xl text-white font-semibold"
                  >
                    Yes, Delete Everything
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}