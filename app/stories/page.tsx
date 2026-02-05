'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles, MagicButton } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

const AI_VOICES = [
  { id: 'Kore', name: 'Kore', emoji: '👩', description: 'Warm, friendly' },
  { id: 'Aoede', name: 'Aoede', emoji: '👩‍🦰', description: 'Gentle, soothing' },
  { id: 'Charon', name: 'Charon', emoji: '👨', description: 'Calm, deep' },
  { id: 'Puck', name: 'Puck', emoji: '🧒', description: 'Playful, fun' },
]

const THEMES = [
  { id: 'adventure', name: 'Adventure', emoji: '🗺️' },
  { id: 'magic', name: 'Magic & Wonder', emoji: '✨' },
  { id: 'animals', name: 'Animal Friends', emoji: '🐾' },
  { id: 'space', name: 'Space & Stars', emoji: '🚀' },
  { id: 'underwater', name: 'Underwater', emoji: '🧜‍♀️' },
  { id: 'dinosaurs', name: 'Dinosaurs', emoji: '🦕' },
  { id: 'fairytale', name: 'Fairy Tale', emoji: '🏰' },
  { id: 'bedtime', name: 'Sleepy & Calm', emoji: '🌙' },
]

const STORY_LENGTHS = [
  { id: '3min', name: '3 min', words: 450 },
  // TODO: Enable when TTS chunking implemented (Google TTS has 4000 char limit)
  // { id: '5min', name: '5 min', words: 750 },
  // { id: '10min', name: '10 min', words: 1500 },
]

const STORY_MESSAGES = [
  "Opening the storybook...",
  "Gathering magical ingredients...",
  "Sprinkling imagination dust...",
  "Weaving the adventure...",
  "Adding sparkles of wonder...",
  "Crafting the perfect ending...",
]

const AUDIO_MESSAGES = [
  "Sprinkling story dust...",
  "Waving the magic wand...",
  "Adding sparkles...",
  "Brewing the magic...",
  "Gathering starlight...",
  "Whispers becoming words...",
]

function StoryLoader({ isVisible }: { isVisible: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setProgress(0)
      setMessageIndex(0)
      return
    }

    const messageInterval = setInterval(() => {
      setMessageIndex(i => (i + 1) % STORY_MESSAGES.length)
    }, 2500)

    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p < 60) return p + 2
        if (p < 80) return p + 0.8
        if (p < 95) return p + 0.2
        return p
      })
    }, 200)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-purple-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center px-8">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
            📖
          </div>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-ping"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {['✨', '⭐', '🌟', '💫'][i % 4]}
            </div>
          ))}
        </div>
        <h2 className="text-white text-2xl font-display mb-2">{STORY_MESSAGES[messageIndex]}</h2>
        <p className="text-purple-200 mb-6">Creating your magical story</p>
        <div className="w-64 mx-auto bg-purple-800/50 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-purple-300 text-sm mt-2">{Math.round(progress)}% complete</p>
      </div>
    </div>
  )
}

function AudioLoader({ isVisible }: { isVisible: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setProgress(0)
      setMessageIndex(0)
      return
    }

    const messageInterval = setInterval(() => {
      setMessageIndex(i => (i + 1) % AUDIO_MESSAGES.length)
    }, 2500)

    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p < 70) return p + 3
        if (p < 85) return p + 1
        if (p < 95) return p + 0.3
        return p
      })
    }, 200)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-purple-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center px-8">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
            🪄
          </div>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-ping"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {['✨', '⭐', '🌟', '💫'][i % 4]}
            </div>
          ))}
        </div>
        <h2 className="text-white text-2xl font-display mb-2">{AUDIO_MESSAGES[messageIndex]}</h2>
        <p className="text-purple-200 mb-6">Creating your magical audio</p>
        <div className="w-64 mx-auto bg-purple-800/50 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-purple-300 text-sm mt-2">{Math.round(progress)}% complete</p>
      </div>
    </div>
  )
}

export default function StoriesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [child, setChild] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [familyVoices, setFamilyVoices] = useState<any[]>([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [selectedVoiceName, setSelectedVoiceName] = useState('')
  const [isCustomVoice, setIsCustomVoice] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('')
  const [selectedLength, setSelectedLength] = useState('3min')
  const [storyMode, setStoryMode] = useState<'instant' | 'custom'>('instant')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [currentStory, setCurrentStory] = useState('')
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savedToLibrary, setSavedToLibrary] = useState(false)
  
  // NEW: Story style toggles
  const [includeChild, setIncludeChild] = useState(true)
  const [adventureLevel, setAdventureLevel] = useState('gentle')
  const [storyStyle, setStoryStyle] = useState('descriptive')

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signup')
      return
    }
    setUser(user)

    // Load subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()
    setSubscription(sub)

    // Load first child
    const { data: children } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)

    if (children && children.length > 0) {
      setChild(children[0])
    } else {
      router.push('/setup/details')
      return
    }

    // Load family voices for premium users
    if (sub?.tier === 'premium') {
      const { data: voices } = await supabase
        .from('voice_clones')
        .select('*')
        .eq('user_id', user.id)
      setFamilyVoices(voices || [])
    }

    // Set default AI voice
    setSelectedVoice(AI_VOICES[0].id)
    setSelectedVoiceName(AI_VOICES[0].name)
  }

  function selectVoice(voiceId: string, voiceName: string, isCustom: boolean) {
    setSelectedVoice(voiceId)
    setSelectedVoiceName(voiceName)
    setIsCustomVoice(isCustom)
  }

  async function generateStory() {
    if (!child || !user) {
      alert('Please wait for your profile to load')
      return
    }

    setIsGenerating(true)
    // Clear previous story - start fresh!
    setCurrentStory('')
    setAudioUrl('')
    setSavedToLibrary(false)

    try {
      const length = STORY_LENGTHS.find(l => l.id === selectedLength)
      const theme = storyMode === 'instant' 
        ? THEMES[Math.floor(Math.random() * THEMES.length)]
        : THEMES.find(t => t.id === selectedTheme)

      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          childName: child.name,
          childAge: child.age,
          interests: child.interests,
          theme: theme?.name || 'magical adventure',
          customPrompt: storyMode === 'custom' ? customPrompt : '',
          storyLength: parseInt(selectedLength.replace('min', '')),
          wordCount: length?.words || 450,
          includeChild: includeChild,
          adventureLevel: adventureLevel,
          storyStyle: storyStyle
        })
      })

      const data = await response.json()

      if (data.error) {
        if (data.blockedContent === 'ip') {
          alert(`🚫 ${data.error}\n\n💡 Tip: Use original characters and ideas for the best stories!`)
        } else if (data.blockedContent === 'harmful') {
          alert(`🚫 ${data.error}\n\n💡 Tip: Keep story ideas gentle, positive and magical!`)
        } else {
          alert(data.error)
        }
        setIsGenerating(false)
        return
      }

      if (data.story) {
        setCurrentStory(data.story)

        // Save to database
        const { data: storyData } = await supabase
          .from('stories')
          .insert({
            user_id: user.id,
            child_id: child.id,
            content: data.story,
            theme: theme?.id || 'magic'
          })
          .select('id')
          .single()

        if (storyData) {
          setCurrentStoryId(storyData.id)
        }
      }
    } catch (error) {
      console.error('Story generation error:', error)
      alert('Failed to generate story. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function generateAudio() {
    if (!currentStory || !selectedVoice) return

    setIsGeneratingAudio(true)

    try {
      let response

      if (isCustomVoice) {
        // Use ElevenLabs for custom voices
        response = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: currentStory,
            voiceId: selectedVoice,
            userId: user.id
          })
        })
      } else {
        // Use Google TTS for AI voices
        response = await fetch('/api/google-tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: currentStory,
            voiceName: selectedVoice,
            stylePrompt: 'Read this as a warm, engaging bedtime story for a child',
            userId: user.id
          })
        })
      }

      if (!response.ok) {
        throw new Error('Failed to generate audio')
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
    } catch (error) {
      console.error('Audio generation error:', error)
      alert('Failed to generate audio. Please try again.')
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  async function saveToLibrary() {
    if (!audioUrl || !currentStoryId) return
    
    setIsSaving(true)
    
    try {
      // Convert audio URL to blob and upload to Supabase Storage
      const response = await fetch(audioUrl)
      const audioBlob = await response.blob()
      
      const fileName = `${user.id}/${currentStoryId}.wav`
      const { error: uploadError } = await supabase.storage
        .from('story-audio')
        .upload(fileName, audioBlob, {
          contentType: 'audio/wav',
          upsert: true
        })
      
      if (uploadError) throw uploadError
      
      // Get public URL and update story record
      const { data: { publicUrl } } = supabase.storage
        .from('story-audio')
        .getPublicUrl(fileName)
      
      await supabase
        .from('stories')
        .update({ audio_url: publicUrl })
        .eq('id', currentStoryId)
      
      setSavedToLibrary(true)
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save to library')
    } finally {
      setIsSaving(false)
    }
  }

  async function shareStory() {
    if (!audioUrl) return
    
    try {
      const response = await fetch(audioUrl)
      const blob = await response.blob()
      const file = new File([blob], 'bedtime-story.wav', { type: 'audio/wav' })
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${child.name}'s Bedtime Story`,
          text: 'Listen to this magical bedtime story!',
          files: [file]
        })
      } else {
        // Fallback: download the file
        const link = document.createElement('a')
        link.href = audioUrl
        link.download = 'bedtime-story.wav'
        link.click()
      }
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  function startNewStory() {
    setCurrentStory('')
    setAudioUrl('')
    setSavedToLibrary(false)
    setCurrentStoryId(null)
    setCustomPrompt('')
  }

  if (!child) {
    return (
      <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">✨</div>
          <p>Loading your magical story space...</p>
        </div>
      </main>
    )
  }

  const isPremium = subscription?.tier === 'premium'
  const hasFamilyVoices = familyVoices.length > 0

  return (
    <main className="min-h-screen bg-magic-gradient p-6 relative overflow-hidden">
      <StoryLoader isVisible={isGenerating} />
      <AudioLoader isVisible={isGeneratingAudio} />
      <Sparkles count={15} />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SleepyBear mood={currentStory ? "happy" : "reading"} size="small" />
            <div>
              <p className="text-purple-200 text-sm">Story time for</p>
              <h1 className="text-white text-2xl font-display">{child.name}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/worlds')}
              className="p-2 bg-white/10 rounded-xl text-purple-200 hover:bg-white/20 transition"
              title="Story Worlds"
            >
              🌍
            </button>
            <button
              onClick={() => router.push('/library')}
              className="p-2 bg-white/10 rounded-xl text-purple-200 hover:bg-white/20 transition"
              title="Library"
            >
              📚
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="p-2 bg-white/10 rounded-xl text-purple-200 hover:bg-white/20 transition"
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Story Options Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
          
          {/* Story Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setStoryMode('instant'); startNewStory(); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                storyMode === 'instant'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-purple-200'
              }`}
            >
              ⚡ Instant Magic
            </button>
            <button
              onClick={() => { setStoryMode('custom'); startNewStory(); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                storyMode === 'custom'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-purple-200'
              }`}
            >
              🎨 Custom Story
            </button>
          </div>

          {/* NEW: Story Style Toggles */}
          <div className="mb-6 grid grid-cols-3 gap-2">
            {/* Include Child */}
            <button
              onClick={() => setIncludeChild(!includeChild)}
              className={`p-3 rounded-xl text-center transition ${
                includeChild 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-white/10'
              }`}
            >
              <div className="text-xl mb-1">👶</div>
              <div className="text-white text-xs font-semibold">
                {includeChild ? child.name : 'No Child'}
              </div>
            </button>

            {/* Adventure Level */}
            <button
              onClick={() => setAdventureLevel(adventureLevel === 'gentle' ? 'adventurous' : 'gentle')}
              className={`p-3 rounded-xl text-center transition ${
                adventureLevel === 'adventurous' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                  : 'bg-white/10'
              }`}
            >
              <div className="text-xl mb-1">{adventureLevel === 'gentle' ? '🌙' : '⚡'}</div>
              <div className="text-white text-xs font-semibold">
                {adventureLevel === 'gentle' ? 'Gentle' : 'Adventure'}
              </div>
            </button>

            {/* Story Style */}
            <button
              onClick={() => setStoryStyle(storyStyle === 'descriptive' ? 'playful' : 'descriptive')}
              className={`p-3 rounded-xl text-center transition ${
                storyStyle === 'playful' 
                  ? 'bg-gradient-to-r from-yellow-500 to-green-500' 
                  : 'bg-white/10'
              }`}
            >
              <div className="text-xl mb-1">{storyStyle === 'descriptive' ? '📖' : '💬'}</div>
              <div className="text-white text-xs font-semibold">
                {storyStyle === 'descriptive' ? 'Descriptive' : 'Playful'}
              </div>
            </button>
          </div>

          {/* Custom Mode Options */}
          {storyMode === 'custom' && (
            <>
              <div className="mb-4">
                <label className="text-purple-200 text-sm mb-2 block">Choose a Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-3 rounded-xl text-center transition ${
                        selectedTheme === theme.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-purple-200 hover:bg-white/15'
                      }`}
                    >
                      <div className="text-xl">{theme.emoji}</div>
                      <div className="text-xs mt-1">{theme.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-purple-200 text-sm mb-2 block">Story Idea (optional)</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={`e.g., "${child.name} finds a magical paintbrush that brings drawings to life..."`}
                  className="w-full bg-white/10 text-white rounded-xl px-4 py-3 h-24 resize-none placeholder-purple-400 border border-white/10 focus:border-purple-400 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Voice Selection */}
          <div className="mb-4">
            <label className="text-purple-200 text-sm mb-2 block">Choose Narrator</label>
            
            {isPremium && (
              <div className="mb-3">
                <p className="text-purple-400 text-xs mb-2">💜 Family Voices</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {hasFamilyVoices ? (
                    <>
                      {familyVoices.map(voice => (
                        <button
                          key={voice.id}
                          onClick={() => selectVoice(voice.voice_id, voice.name, true)}
                          className={`p-3 rounded-xl text-center transition ${
                            selectedVoice === voice.voice_id && isCustomVoice
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30'
                          }`}
                        >
                          <div className="text-2xl mb-1">{voice.emoji}</div>
                          <div className="font-semibold text-sm">{voice.name}</div>
                        </button>
                      ))}
                      {familyVoices.length < 4 && (
                        <button
                          onClick={() => router.push('/settings')}
                          className="p-3 rounded-xl text-center bg-white/5 text-purple-300 border border-dashed border-purple-400/50 hover:bg-white/10 transition"
                        >
                          <div className="text-2xl mb-1">➕</div>
                          <div className="text-xs">Add Voice</div>
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => router.push('/settings')}
                      className="col-span-full p-4 rounded-xl text-center bg-purple-500/20 text-purple-200 border border-dashed border-purple-400/50 hover:bg-purple-500/30 transition"
                    >
                      <div className="text-2xl mb-1">🎤</div>
                      <div className="font-semibold">Record Your First Family Voice</div>
                      <div className="text-xs opacity-70">Mum, Dad, Nanna, Pop...</div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {!isPremium && (
              <div className="mb-3">
                <button
                  onClick={() => router.push('/upgrade')}
                  className="w-full p-4 rounded-xl text-left bg-white/5 text-purple-300 border border-dashed border-purple-400/50 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🔒</div>
                    <div>
                      <div className="font-semibold">Family Voices</div>
                      <div className="text-xs opacity-70">Upgrade to Premium to record Mum, Dad, Nanna, Pop...</div>
                    </div>
                  </div>
                </button>
              </div>
            )}

            <p className="text-purple-400 text-xs mb-2">🤖 AI Narrators</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AI_VOICES.map(voice => (
                <button
                  key={voice.id}
                  onClick={() => selectVoice(voice.id, voice.name, false)}
                  className={`p-3 rounded-xl text-center transition ${
                    selectedVoice === voice.id && !isCustomVoice
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-purple-200 hover:bg-white/15'
                  }`}
                >
                  <div className="text-2xl mb-1">{voice.emoji}</div>
                  <div className="font-semibold text-sm">{voice.name}</div>
                  <div className="text-xs opacity-70">{voice.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Length Selection */}
          <div className="mb-6">
            <label className="text-purple-200 text-sm mb-2 block">Length</label>
            <div className="flex gap-3">
              {isPremium ? (
                STORY_LENGTHS.map(length => (
                  <button
                    key={length.id}
                    onClick={() => setSelectedLength(length.id)}
                    className={`flex-1 py-2 rounded-xl font-semibold ${
                      selectedLength === length.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/10 text-purple-200'
                    }`}
                  >
                    {length.name}
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => setSelectedLength('3min')}
                    className="flex-1 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    3 min
                  </button>
                  <button
                    onClick={() => router.push('/upgrade')}
                    className="flex-[2] py-2 rounded-xl font-semibold bg-white/5 text-purple-300 border border-dashed border-purple-400/50 hover:bg-white/10 transition"
                  >
                    🔒 5-10 min → Upgrade
                  </button>
                </>
              )}
            </div>
          </div>

          <MagicButton onClick={generateStory} disabled={isGenerating || !selectedVoice || !user}>
            {isGenerating ? 'Creating Magic...' : storyMode === 'instant' ? '✨ Instant Magic Story' : '✨ Create My Story'}
          </MagicButton>
        </div>

        {/* Story Display */}
        {currentStory && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-white">Your Story</h2>
              <button
                onClick={startNewStory}
                className="text-purple-300 hover:text-white text-sm"
              >
                ✨ New Story
              </button>
            </div>
            <div className="space-y-3 text-purple-100 max-h-96 overflow-y-auto mb-6">
              {currentStory.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {!audioUrl && (
              <MagicButton onClick={generateAudio} disabled={isGeneratingAudio}>
                {isGeneratingAudio ? 'Creating Audio...' : `🎧 Listen ${isCustomVoice ? `in ${selectedVoiceName}'s Voice` : 'to Story'}`}
              </MagicButton>
            )}

            {audioUrl && (
              <div className="bg-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <SleepyBear mood="happy" size="small" />
                  <h3 className="text-white font-display">
                    {isCustomVoice ? `💜 ${selectedVoiceName}'s voice is ready!` : '🎧 Ready to listen!'}
                  </h3>
                </div>
                <audio controls src={audioUrl} className="w-full mb-4"></audio>
                
                <div className="flex gap-3">
                  <button
                    onClick={saveToLibrary}
                    disabled={isSaving || savedToLibrary}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : savedToLibrary ? '✅ Saved to Library' : '📚 Save to Library'}
                  </button>
                  {isPremium && isCustomVoice && (
                    <button
                      onClick={shareStory}
                      className="py-3 px-4 bg-white/10 rounded-xl font-semibold text-purple-200 hover:bg-white/20 transition"
                      title="Share audio file"
                    >
                      📤
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
