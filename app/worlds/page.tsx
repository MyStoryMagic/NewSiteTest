'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

const WORLD_TEMPLATES = [
  { id: 'underwater', name: 'Underwater Kingdom', emoji: '🧜‍♀️', setting: 'A magical kingdom beneath the waves, with coral castles, friendly dolphins, and mysterious deep-sea caves.' },
  { id: 'space', name: 'Space Station', emoji: '🚀', setting: 'A friendly space station orbiting a colorful planet, with robot helpers, alien friends, and starship adventures.' },
  { id: 'wizard', name: 'Wizard School', emoji: '🧙‍♂️', setting: 'A magical school where young wizards learn spells, brew potions, and discover enchanted secrets.' },
  { id: 'dinosaur', name: 'Dinosaur Valley', emoji: '🦕', setting: 'A hidden valley where friendly dinosaurs live, with volcanoes, jungle adventures, and prehistoric fun.' },
  { id: 'fairy', name: 'Fairy Castle', emoji: '🏰', setting: 'An enchanted castle in the clouds where fairies, unicorns, and magical creatures live in harmony.' },
  { id: 'pirates', name: 'Pirate Island', emoji: '🏴‍☠️', setting: 'A tropical island with friendly pirates, treasure hunts, talking parrots, and sailing adventures.' },
  { id: 'jungle', name: 'Enchanted Jungle', emoji: '🌴', setting: 'A magical jungle filled with talking animals, hidden temples, and amazing discoveries around every tree.' },
  { id: 'arctic', name: 'Arctic Wonderland', emoji: '🐧', setting: 'A sparkling frozen land with penguin friends, polar bears, ice caves, and northern lights magic.' },
]

export default function WorldsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [worlds, setWorlds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signup')
      return
    }
    setUser(user)

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    setSubscription(sub)

    const { data: worldsData } = await supabase
      .from('worlds')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setWorlds(worldsData || [])
    setLoading(false)
  }

  async function createWorld(template: typeof WORLD_TEMPLATES[0]) {
    if (!user) return

    const { data, error } = await supabase
      .from('worlds')
      .insert({
        user_id: user.id,
        name: template.name,
        emoji: template.emoji,
        template: template.id,
        setting: template.setting
      })
      .select()
      .single()

    if (data) {
      router.push(`/worlds/${data.id}`)
    }
  }

  async function deleteWorld(worldId: string, worldName: string, e: React.MouseEvent) {
    e.stopPropagation()
    
    if (!confirm(`Delete "${worldName}" and all its characters, sagas, and stories?\n\nThis cannot be undone.`)) {
      return
    }

    setDeleting(worldId)

    try {
      await supabase.from('stories').delete().eq('world_id', worldId)
      await supabase.from('sagas').delete().eq('world_id', worldId)
      await supabase.from('world_characters').delete().eq('world_id', worldId)
      await supabase.from('worlds').delete().eq('id', worldId)

      setWorlds(worlds.filter(w => w.id !== worldId))
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete world')
    } finally {
      setDeleting(null)
    }
  }

  function openWorld(worldId: string) {
    router.push(`/worlds/${worldId}`)
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
      <Sparkles count={12} />

      <div className="max-w-2xl mx-auto relative z-10">
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
                <h1 className="text-white text-2xl font-display">World Builder</h1>
                <p className="text-purple-200 text-sm">Create magical story universes</p>
              </div>
            </div>
          </div>
        </div>

        {worlds.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-display text-lg mb-4">Your Worlds</h2>
            <div className="space-y-3">
              {worlds.map(world => (
                <div
                  key={world.id}
                  onClick={() => openWorld(world.id)}
                  className="w-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-4 text-left hover:bg-white/15 transition cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{world.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-display text-lg">{world.name}</h3>
                      <p className="text-purple-300 text-sm line-clamp-1">{world.setting}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => deleteWorld(world.id, world.name, e)}
                        disabled={deleting === world.id}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition"
                        title="Delete world"
                      >
                        {deleting === world.id ? '...' : '🗑️'}
                      </button>
                      <div className="text-purple-400">→</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-white font-display text-lg mb-2">Create New World</h2>
          <p className="text-purple-300 text-sm mb-4">Choose a template to start your story universe</p>
          
          <div className="grid grid-cols-2 gap-3">
            {WORLD_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => createWorld(template)}
                className="p-4 bg-white/10 rounded-xl text-left hover:bg-white/20 transition group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition">{template.emoji}</div>
                <div className="text-white font-semibold text-sm">{template.name}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => router.push('/worlds/new')}
            className="w-full mt-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-dashed border-purple-400/50 text-left hover:bg-purple-500/30 transition"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">✨</div>
              <div>
                <div className="text-white font-semibold">Create Custom World</div>
                <div className="text-purple-300 text-xs">Design your own magical universe</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </main>
  )
}
