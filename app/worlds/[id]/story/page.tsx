'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Sparkles, MagicButton } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

const AI_VOICES = [
  { id: 'Kore', name: 'Kore', emoji: '👩', description: 'Warm, friendly' },
  { id: 'Aoede', name: 'Aoede', emoji: '👩‍🦰', description: 'Gentle, soothing' },
  { id: 'Charon', name: 'Charon', emoji: '👨', description: 'Calm, deep' },
  { id: 'Puck', name: 'Puck', emoji: '🧒', description: 'Playful, fun' },
]

const STORY_LENGTHS = [
  { id: '3min', name: '3 min', words: 450 },
  { id: '5min', name: '5 min', words: 750 },
  { id: '10min', name: '10 min', words: 1500 },
]

const LOADER_MESSAGES = [
  "Opening the storybook...",
  "Gathering the characters...",
  "Weaving the adventure...",
  "Adding sparkles of wonder...",
]

function Loader({ isVisible, emoji }: { isVisible: boolean, emoji: string }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) { setProgress(0); setMessageIndex(0); return }
    const mi = setInterval(() => setMessageIndex(i => (i + 1) % LOADER_MESSAGES.length), 2500)
    const pi = setInterval(() => setProgress(p => p < 95 ? p + 1.5 : p), 200)
    return () => { clearInterval(mi); clearInterval(pi) }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-purple-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center px-8">
        <div className="text-6xl mb-6 animate-bounce">{emoji}</div>
        <h2 className="text-white text-2xl font-display mb-2">{LOADER_MESSAGES[messageIndex]}</h2>
        <div className="w-64 mx-auto bg-purple-800/50 rounded-full h-3 overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

export default function WorldStoryPage() {
  const router = useRouter()
  const params = useParams()
  const worldId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [child, setChild] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [world, setWorld] = useState<any>(null)
  const [characters, setCharacters] = useState<any[]>([])
  const [familyVoices, setFamilyVoices] = useState<any[]>([])
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('')
  const [selectedVoiceName, setSelectedVoiceName] = useState('')
  const [isCustomVoice, setIsCustomVoice] = useState(false)
  const [selectedLength, setSelectedLength] = useState('3min')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [currentStory, setCurrentStory] = useState('')
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savedToLibrary, setSavedToLibrary] = useState(false)
  const [includeChild, setIncludeChild] = useState(true)
  const [adventureLevel, setAdventureLevel] = useState('gentle')
  const [storyStyle, setStoryStyle] = useState('descriptive')

  useEffect(() => { loadData() }, [worldId])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/signup'); return }
    setUser(user)

    const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
    setSubscription(sub)

    const { data: children } = await supabase.from('children').select('*').eq('user_id', user.id).limit(1)
    if (children?.[0]) setChild(children[0])

    const { data: worldData } = await supabase.from('worlds').select('*').eq('id', worldId).single()
    setWorld(worldData)
    if (worldData) {
      setIncludeChild(worldData.include_child !== false)
      setAdventureLevel(worldData.adventure_level || 'gentle')
      setStoryStyle(worldData.story_style || 'descriptive')
    }

    const { data: charsData } = await supabase.from('world_characters').select('*').eq('world_id', worldId)
    setCharacters(charsData || [])

    if (sub?.tier === 'premium') {
      const { data: voices } = await supabase.from('voice_clones').select('*').eq('user_id', user.id)
      setFamilyVoices(voices || [])
    }

    setSelectedVoice(AI_VOICES[0].id)
    setSelectedVoiceName(AI_VOICES[0].name)
  }

  function toggleCharacter(charId: string) {
    setSelectedCharacters(prev => prev.includes(charId) ? prev.filter(id => id !== charId) : [...prev, charId])
  }

  function selectVoice(voiceId: string, voiceName: string, isCustom: boolean) {
    setSelectedVoice(voiceId)
    setSelectedVoiceName(voiceName)
    setIsCustomVoice(isCustom)
  }

  async function generateStory() {
    if (!child || !world) return
    setIsGenerating(true)
    setCurrentStory('')
    setAudioUrl('')
    setSavedToLibrary(false)

    try {
      const length = STORY_LENGTHS.find(l => l.id === selectedLength)
      const selectedChars = characters.filter(c => selectedCharacters.includes(c.id))

      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: child.name,
          childAge: child.age,
          interests: child.interests,
          worldName: world.name,
          worldSetting: world.setting,
          characters: selectedChars.map(c => ({ name: c.name, role: c.role })),
          customPrompt,
          storyLength: selectedLength,
          wordCount: length?.words || 450,
          includeChild,
          adventureLevel,
          storyStyle
        })
      })

      const data = await response.json()

      if (data.error) {
        alert(data.blockedContent === 'ip' 
          ? `🚫 ${data.error}\n\n💡 Use original characters!`
          : data.blockedContent === 'harmful'
          ? `🚫 ${data.error}\n\n💡 Keep it magical!`
          : data.error)
        setIsGenerating(false)
        return
      }

      if (data.story) {
        setCurrentStory(data.story)
        const { data: storyData } = await supabase
          .from('stories')
          .insert({ user_id: user.id, child_id: child.id, world_id: worldId, content: data.story, theme: world.template })
          .select('id')
          .single()
        if (storyData) setCurrentStoryId(storyData.id)
      }
    } catch (error) {
      alert('Failed to generate story')
    } finally {
      setIsGenerating(false)
    }
  }

  async function generateAudio() {
    if (!currentStory || !selectedVoice) return
    setIsGeneratingAudio(true)

    try {
      const response = isCustomVoice
        ? await fetch('/api/text-to-speech', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: currentStory, voiceId: selectedVoice }) })
        : await fetch('/api/google-tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: currentStory, voiceName: selectedVoice, stylePrompt: 'Read this as a warm bedtime story' }) })

      if (!response.ok) throw new Error('Failed')
      const audioBlob = await response.blob()
      setAudioUrl(URL.createObjectURL(audioBlob))
    } catch (error) {
      alert('Failed to generate audio')
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  async function saveToLibrary() {
    if (!audioUrl || !currentStoryId) return
    setIsSaving(true)
    try {
      const response = await fetch(audioUrl)
      const audioBlob = await response.blob()
      const fileName = `${user.id}/${currentStoryId}.wav`
      await supabase.storage.from('story-audio').upload(fileName, audioBlob, { contentType: 'audio/wav', upsert: true })
      const { data: { publicUrl } } = supabase.storage.from('story-audio').getPublicUrl(fileName)
      await supabase.from('stories').update({ audio_url: publicUrl }).eq('id', currentStoryId)
      setSavedToLibrary(true)
    } catch (error) {
      alert('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const isPremium = subscription?.tier === 'premium'

  if (!world) {
    return <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center"><div className="text-white">Loading...</div></main>
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6">
      <Loader isVisible={isGenerating} emoji="📖" />
      <Loader isVisible={isGeneratingAudio} emoji="🪄" />
      <Sparkles count={10} />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => router.push(`/worlds/${worldId}`)} className="text-purple-300 hover:text-white mb-4">
            ← Back to {world.name}
          </button>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{world.emoji}</div>
            <div>
              <h1 className="text-white text-2xl font-display">New Story</h1>
              <p className="text-purple-200 text-sm">
                {includeChild ? `⭐ ${child?.name}` : '👥 Characters'} • 
                {adventureLevel === 'gentle' ? ' 🌙 Gentle' : ' ⚡ Adventure'} • 
                {storyStyle === 'descriptive' ? ' 📖 Descriptive' : ' 💬 Playful'}
              </p>
            </div>
          </div>
        </div>

        {/* Story Options */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
          
          {/* Settings Row */}
          <div className="mb-6 grid grid-cols-3 gap-2">
            {/* Include Child */}
            <button
              onClick={() => setIncludeChild(!includeChild)}
              className={`p-3 rounded-xl text-center transition ${includeChild ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10'}`}
            >
              <div className="text-xl mb-1">👶</div>
              <div className="text-white text-xs font-semibold">{includeChild ? child?.name : 'No Child'}</div>
            </button>

            {/* Adventure Level */}
            <button
              onClick={() => setAdventureLevel(adventureLevel === 'gentle' ? 'adventurous' : 'gentle')}
              className={`p-3 rounded-xl text-center transition ${adventureLevel === 'adventurous' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-white/10'}`}
            >
              <div className="text-xl mb-1">{adventureLevel === 'gentle' ? '🌙' : '⚡'}</div>
              <div className="text-white text-xs font-semibold">{adventureLevel === 'gentle' ? 'Gentle' : 'Adventure'}</div>
            </button>

            {/* Story Style */}
            <button
              onClick={() => setStoryStyle(storyStyle === 'descriptive' ? 'playful' : 'descriptive')}
              className={`p-3 rounded-xl text-center transition ${storyStyle === 'playful' ? 'bg-gradient-to-r from-yellow-500 to-green-500' : 'bg-white/10'}`}
            >
              <div className="text-xl mb-1">{storyStyle === 'descriptive' ? '📖' : '💬'}</div>
              <div className="text-white text-xs font-semibold">{storyStyle === 'descriptive' ? 'Descriptive' : 'Playful'}</div>
            </button>
          </div>

          {/* Characters */}
          {characters.length > 0 && (
            <div className="mb-6">
              <label className="text-purple-200 text-sm mb-2 block">Include Characters</label>
              <div className="flex flex-wrap gap-2">
                {characters.map(char => (
                  <button
                    key={char.id}
                    onClick={() => toggleCharacter(char.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
                      selectedCharacters.includes(char.id) ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/10 text-purple-200'
                    }`}
                  >
                    <span>{char.emoji}</span>
                    <span className="text-sm">{char.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Story Idea */}
          <div className="mb-6">
            <label className="text-purple-200 text-sm mb-2 block">Story Idea (optional)</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., They discover a hidden treasure map..."
              className="w-full bg-white/10 text-white rounded-xl px-4 py-3 h-20 resize-none placeholder-purple-400 border border-white/10 focus:border-purple-400 focus:outline-none"
            />
          </div>

          {/* Voice Selection */}
          <div className="mb-6">
            <label className="text-purple-200 text-sm mb-2 block">Narrator</label>
            {isPremium && familyVoices.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {familyVoices.map(voice => (
                    <button
                      key={voice.id}
                      onClick={() => selectVoice(voice.voice_id, voice.name, true)}
                      className={`p-2 rounded-xl transition ${selectedVoice === voice.voice_id && isCustomVoice ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-purple-500/20 text-purple-200'}`}
                    >
                      <span className="text-xl mr-1">{voice.emoji}</span>
                      <span className="text-sm">{voice.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {AI_VOICES.map(voice => (
                <button
                  key={voice.id}
                  onClick={() => selectVoice(voice.id, voice.name, false)}
                  className={`p-2 rounded-xl transition ${selectedVoice === voice.id && !isCustomVoice ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/10 text-purple-200'}`}
                >
                  <span className="text-xl mr-1">{voice.emoji}</span>
                  <span className="text-sm">{voice.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="mb-6">
            <label className="text-purple-200 text-sm mb-2 block">Length</label>
            <div className="flex gap-2">
              {(isPremium ? STORY_LENGTHS : [STORY_LENGTHS[0]]).map(length => (
                <button
                  key={length.id}
                  onClick={() => setSelectedLength(length.id)}
                  className={`flex-1 py-2 rounded-xl font-semibold ${selectedLength === length.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/10 text-purple-200'}`}
                >
                  {length.name}
                </button>
              ))}
              {!isPremium && (
                <button onClick={() => router.push('/upgrade')} className="flex-[2] py-2 rounded-xl bg-white/5 text-purple-300 border border-dashed border-purple-400/50">
                  🔒 5-10 min
                </button>
              )}
            </div>
          </div>

          <MagicButton onClick={generateStory} disabled={isGenerating}>
            ✨ Create Story
          </MagicButton>
        </div>

        {/* Story Display */}
        {currentStory && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="font-display text-xl text-white mb-4">Your Story</h2>
            <div className="space-y-3 text-purple-100 max-h-96 overflow-y-auto mb-6">
              {currentStory.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {!audioUrl && (
              <MagicButton onClick={generateAudio} disabled={isGeneratingAudio}>
                🎧 Listen {isCustomVoice ? `in ${selectedVoiceName}'s Voice` : 'to Story'}
              </MagicButton>
            )}

            {audioUrl && (
              <div className="bg-purple-500/20 rounded-xl p-4">
                <audio controls src={audioUrl} className="w-full mb-4" />
                <button
                  onClick={saveToLibrary}
                  disabled={isSaving || savedToLibrary}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : savedToLibrary ? '✅ Saved!' : '📚 Save to Library'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
