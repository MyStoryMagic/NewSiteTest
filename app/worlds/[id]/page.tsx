'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles, MagicButton } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

export default function WorldPage() {
  const router = useRouter()
  const params = useParams()
  const worldId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [child, setChild] = useState<any>(null)
  const [world, setWorld] = useState<any>(null)
  const [characters, setCharacters] = useState<any[]>([])
  const [sagas, setSagas] = useState<any[]>([])
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCharacter, setShowAddCharacter] = useState(false)
  const [showCreateSaga, setShowCreateSaga] = useState(false)
  const [newCharacter, setNewCharacter] = useState({ name: '', role: '', emoji: '👤' })
  const [newSaga, setNewSaga] = useState({ name: '', description: '' })
  const [includeChild, setIncludeChild] = useState(true)
  const [adventureLevel, setAdventureLevel] = useState('gentle')
  const [storyStyle, setStoryStyle] = useState('descriptive')

  useEffect(() => {
    loadWorld()
  }, [worldId])

  async function loadWorld() {
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
      .limit(1)
    if (children?.[0]) setChild(children[0])

    const { data: worldData, error } = await supabase
      .from('worlds')
      .select('*')
      .eq('id', worldId)
      .single()

    if (!worldData) {
      router.push('/worlds')
      return
    }
    setWorld(worldData)
    setIncludeChild(worldData.include_child !== false)
    setAdventureLevel(worldData.adventure_level || 'gentle')
    setStoryStyle(worldData.story_style || 'descriptive')

    const { data: charsData } = await supabase
      .from('world_characters')
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: true })
    setCharacters(charsData || [])

    const { data: sagasData } = await supabase
      .from('sagas')
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: false })
    setSagas(sagasData || [])

    const { data: storiesData } = await supabase
      .from('stories')
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: false })
      .limit(5)
    setStories(storiesData || [])

    setLoading(false)
  }

  async function updateWorldSetting(field: string, value: any) {
    await supabase
      .from('worlds')
      .update({ [field]: value })
      .eq('id', worldId)
  }

  async function toggleIncludeChild() {
    const newValue = !includeChild
    setIncludeChild(newValue)
    updateWorldSetting('include_child', newValue)
  }

  async function toggleAdventureLevel() {
    const newValue = adventureLevel === 'gentle' ? 'adventurous' : 'gentle'
    setAdventureLevel(newValue)
    updateWorldSetting('adventure_level', newValue)
  }

  async function toggleStoryStyle() {
    const newValue = storyStyle === 'descriptive' ? 'playful' : 'descriptive'
    setStoryStyle(newValue)
    updateWorldSetting('story_style', newValue)
  }

  async function addCharacter() {
    if (!newCharacter.name.trim()) return

    const { data } = await supabase
      .from('world_characters')
      .insert({
        world_id: worldId,
        name: newCharacter.name,
        role: newCharacter.role,
        emoji: newCharacter.emoji
      })
      .select()
      .single()

    if (data) {
      setCharacters([...characters, data])
      setNewCharacter({ name: '', role: '', emoji: '👤' })
      setShowAddCharacter(false)
    }
  }

  async function deleteCharacter(charId: string) {
    await supabase
      .from('world_characters')
      .delete()
      .eq('id', charId)
    
    setCharacters(characters.filter(c => c.id !== charId))
  }

  async function createSaga() {
    if (!newSaga.name.trim()) return

    const { data } = await supabase
      .from('sagas')
      .insert({
        world_id: worldId,
        user_id: user.id,
        name: newSaga.name,
        description: newSaga.description
      })
      .select()
      .single()

    if (data) {
      router.push(`/worlds/${worldId}/saga/${data.id}`)
    }
  }

  async function deleteWorld() {
    if (!confirm('Delete this world and all its stories? This cannot be undone.')) return

    await supabase.from('stories').delete().eq('world_id', worldId)
    await supabase.from('sagas').delete().eq('world_id', worldId)
    await supabase.from('world_characters').delete().eq('world_id', worldId)
    await supabase.from('worlds').delete().eq('id', worldId)
    
    router.push('/worlds')
  }

  function startStoryInWorld() {
    router.push(`/worlds/${worldId}/story`)
  }

  const CHARACTER_EMOJIS = ['👤', '👸', '🤴', '🧙‍♂️', '🧚', '🦸', '🐉', '🤖', '🧜‍♀️', '🦁', '🐻', '🦊', '🐬', '🦄', '🧝‍♀️', '👻']

  if (loading) {
    return (
      <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center">
        <div className="text-white">Loading world...</div>
      </main>
    )
  }

  if (!world) {
    return (
      <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center">
        <div className="text-white">World not found</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6">
      <Sparkles count={10} />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/worlds')}
            className="text-purple-300 hover:text-white mb-4 flex items-center gap-1"
          >
            ← Back to Worlds
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-5xl">{world.emoji}</div>
            <div>
              <h1 className="text-white text-3xl font-display">{world.name}</h1>
              <p className="text-purple-200 text-sm">{world.setting}</p>
            </div>
          </div>
        </div>

        {/* World Settings */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-4 mb-6 space-y-4">
          <h3 className="text-white font-semibold text-sm">Story Settings</h3>
          
          {/* Child Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">👶</div>
              <div>
                <div className="text-white font-semibold text-sm">Include {child?.name || 'Child'}</div>
                <div className="text-purple-300 text-xs">
                  {includeChild 
                    ? `${child?.name || 'Your child'} is the hero` 
                    : 'World characters only'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleIncludeChild}
              className={`w-14 h-8 rounded-full transition-all ${
                includeChild ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
              }`}
            >
              <div 
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                  includeChild ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Adventure Level Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{adventureLevel === 'gentle' ? '🌙' : '⚡'}</div>
              <div>
                <div className="text-white font-semibold text-sm">Adventure Level</div>
                <div className="text-purple-300 text-xs">
                  {adventureLevel === 'gentle' 
                    ? 'Calm & soothing' 
                    : 'Exciting challenges'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleAdventureLevel}
              className={`w-14 h-8 rounded-full transition-all ${
                adventureLevel === 'adventurous' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-white/20'
              }`}
            >
              <div 
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                  adventureLevel === 'adventurous' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Story Style Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{storyStyle === 'descriptive' ? '📖' : '💬'}</div>
              <div>
                <div className="text-white font-semibold text-sm">Story Style</div>
                <div className="text-purple-300 text-xs">
                  {storyStyle === 'descriptive' 
                    ? 'Rich descriptions' 
                    : 'Silly dialogue & wordplay'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleStoryStyle}
              className={`w-14 h-8 rounded-full transition-all ${
                storyStyle === 'playful' ? 'bg-gradient-to-r from-yellow-500 to-green-500' : 'bg-white/20'
              }`}
            >
              <div 
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                  storyStyle === 'playful' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={startStoryInWorld}
            className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-left hover:opacity-90 transition"
          >
            <div className="text-2xl mb-2">✨</div>
            <div className="text-white font-semibold">New Story</div>
            <div className="text-purple-100 text-xs">Single adventure</div>
          </button>
          
          <button
            onClick={() => setShowCreateSaga(true)}
            className="p-4 bg-white/10 backdrop-blur rounded-2xl text-left border border-white/10 hover:bg-white/15 transition"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="text-white font-semibold">New Saga</div>
            <div className="text-purple-200 text-xs">Multi-part series</div>
          </button>
        </div>

        {/* Characters */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-display text-lg">Characters</h2>
            <button
              onClick={() => setShowAddCharacter(true)}
              className="text-purple-300 hover:text-white text-sm"
            >
              + Add Character
            </button>
          </div>

          {characters.length === 0 && !showAddCharacter ? (
            <p className="text-purple-400 text-sm">No characters yet. Add some to make your stories richer!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {characters.map(char => (
                <div
                  key={char.id}
                  className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 group"
                >
                  <span className="text-xl">{char.emoji}</span>
                  <div>
                    <div className="text-white text-sm font-semibold">{char.name}</div>
                    {char.role && <div className="text-purple-300 text-xs">{char.role}</div>}
                  </div>
                  <button
                    onClick={() => deleteCharacter(char.id)}
                    className="text-purple-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddCharacter && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="space-y-3">
                <div>
                  <label className="text-purple-200 text-sm mb-1 block">Emoji</label>
                  <div className="flex gap-2 flex-wrap">
                    {CHARACTER_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setNewCharacter({ ...newCharacter, emoji })}
                        className={`text-2xl p-1 rounded ${newCharacter.emoji === emoji ? 'bg-purple-500' : 'hover:bg-white/10'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Character name"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                  className="w-full bg-white/10 text-white rounded-xl px-4 py-2 border border-white/10 focus:border-purple-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Role (e.g., Brave knight, Wise owl)"
                  value={newCharacter.role}
                  onChange={(e) => setNewCharacter({ ...newCharacter, role: e.target.value })}
                  className="w-full bg-white/10 text-white rounded-xl px-4 py-2 border border-white/10 focus:border-purple-400 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddCharacter(false)}
                    className="flex-1 py-2 bg-white/10 rounded-xl text-purple-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCharacter}
                    className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold"
                  >
                    Add Character
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sagas */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
          <h2 className="text-white font-display text-lg mb-4">Sagas</h2>

          {sagas.length === 0 && !showCreateSaga ? (
            <div className="text-center py-4">
              <p className="text-purple-400 text-sm mb-3">No sagas yet. Create a multi-part adventure!</p>
              <button
                onClick={() => setShowCreateSaga(true)}
                className="px-4 py-2 bg-white/10 rounded-xl text-purple-200 hover:bg-white/15 transition"
              >
                📚 Create First Saga
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sagas.map(saga => (
                <button
                  key={saga.id}
                  onClick={() => router.push(`/worlds/${worldId}/saga/${saga.id}`)}
                  className="w-full p-4 bg-white/5 rounded-xl text-left hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">{saga.name}</div>
                      {saga.description && (
                        <div className="text-purple-300 text-sm">{saga.description}</div>
                      )}
                      <div className="text-purple-400 text-xs mt-1">
                        {saga.episode_count || 0} episodes
                      </div>
                    </div>
                    <div className="text-purple-400">→</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showCreateSaga && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h3 className="text-white font-semibold mb-3">New Saga</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Saga name (e.g., The Crystal Quest)"
                  value={newSaga.name}
                  onChange={(e) => setNewSaga({ ...newSaga, name: e.target.value })}
                  className="w-full bg-white/10 text-white rounded-xl px-4 py-2 border border-white/10 focus:border-purple-400 focus:outline-none"
                />
                <textarea
                  placeholder="Brief description (optional)"
                  value={newSaga.description}
                  onChange={(e) => setNewSaga({ ...newSaga, description: e.target.value })}
                  className="w-full bg-white/10 text-white rounded-xl px-4 py-2 border border-white/10 h-20 resize-none focus:border-purple-400 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateSaga(false)}
                    className="flex-1 py-2 bg-white/10 rounded-xl text-purple-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createSaga}
                    className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold"
                  >
                    Create Saga
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Stories */}
        {stories.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
            <h2 className="text-white font-display text-lg mb-4">Recent Stories</h2>
            <div className="space-y-2">
              {stories.map(story => (
                <div key={story.id} className="p-3 bg-white/5 rounded-xl">
                  <div className="text-white text-sm line-clamp-2">{story.content?.substring(0, 100)}...</div>
                  <div className="text-purple-400 text-xs mt-1">
                    {new Date(story.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="text-center">
          <button
            onClick={deleteWorld}
            className="text-red-400 text-sm hover:text-red-300 transition"
          >
            🗑️ Delete World
          </button>
        </div>
      </div>
    </main>
  )
}
